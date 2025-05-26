import os
import subprocess
import shutil
import requests
import time

# Search Params
CLONE_DIR = "cloned_repos"
OUTPUT_DIR = "terraform_data"

PROVIDERS = {
#    "aws": 'provider "aws"',
    "azure": 'provider "azurerm"',
#    "gcp": 'provider "google"'
}

#Run Commands
def run_command(command):
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip()


# Search Repositories with gh cli - dependency and auth needed (gh cli)
def search_repositories():
    repos = []
    page = 1  # GitHub-Seiten beginnen bei 1
    per_page = 100  # Maximal erlaubt
    base_url = "https://api.github.com/search/repositories"
    query = "topic:terraform+topic:azure+language:HCL"
    
    while True:
        url = f"{base_url}?q={query}&per_page={per_page}&page={page}&sort=stars&order=desc"
        response = requests.get(url)

        # Rate Limit prüfen
        if response.status_code == 403 and 'X-RateLimit-Remaining' in response.headers and response.headers['X-RateLimit-Remaining'] == '0':
            reset_time = int(response.headers['X-RateLimit-Reset'])
            sleep_time = reset_time - int(time.time()) + 5  # 5s Puffer
            print(f"Rate limit reached. Sleeping for {sleep_time} seconds...")
            time.sleep(sleep_time)
            continue

        if response.status_code != 200:
            print(f"Fehler: {response.status_code}, {response.text}")
            break

        data = response.json()
        if 'items' in data and data['items']:
            repos.extend(data['items'])
            print(f"Seite {page} geladen, Repos bisher: {len(repos)}")
            page += 1
            time.sleep(1)
        else:
            break
    
    print(f"Gefundene Repos: {len(repos)}")
    return repos


# Clone Repo to check files
def clone_repository(repo):
    repo_dir = f"{CLONE_DIR}/{repo['name']}"
    run_command(f"gh repo clone {repo['clone_url']} {repo_dir}")
    return repo_dir

# Search for terraform files and readme files
def find_tf_files_and_redme(repo_path): 
    tf_files = []
    for root,_, files in os.walk(repo_path): 
        for file in files: 
            if file.endswith(".tf"):
                tf_files.append(os.path.join(root,file))
            if file.lower() == "readme.md":
                readme_file=os.path.join(root,file)
    return tf_files, readme_file


# save terraform and readme files in own dir
def save_data_for_annotation(repo_name, tf_files, readme_file, provider_name):
    repo_dir = os.path.join(OUTPUT_DIR, provider_name, repo_name)
    os.makedirs(repo_dir, exist_ok=True)

    tf_dir = os.path.join(repo_dir, "terraform")
    os.makedirs(tf_dir, exist_ok=True)

    for tf in tf_files:
        shutil.copy(tf, tf_dir)

    if readme_file:
        shutil.copy(readme_file, repo_dir)

# Check for provider in terraform files
def provider_in_file(tf_file, provider_str):
    with open(tf_file, "r", encoding="utf-8", errors='ignore') as f:
        content = f.read()
        return provider_str in content
         
def main():
    os.makedirs(CLONE_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    count = 0
    print("[*] Search for Terraform repositories...")
    repos = search_repositories()

    for repo in repos:
        try:
            repo_path = clone_repository(repo)

            tf_files, readme_file = find_tf_files_and_redme(repo_path)

            for provider_name, provider_str in PROVIDERS.items():
                if any(provider_in_file(tf_file, provider_str) for tf_file in tf_files):
                    save_data_for_annotation(repo['name'], tf_files, readme_file, provider_name)
                    count += 1
                    print(f"[✓] Found {provider_name} in {repo['name']} Count: {count}")
                    break
                else:
                    print("next...")

        except Exception as e:
            print(f"Error by {repo['name']} - {repo['url']}: {e}")

    print("Done!")

if __name__ == "__main__":
    main()