# The purpose of this script is to go through the crawled terraform configurations
# and use terraform init and validate to check them for correctness 

import os
import subprocess
import shutil

START_PATH = "terraform_data/azure"


def terrform_command(path):
    #terraform init
    try:
        print("Check terraform init...")
        result_init = subprocess.run(
            ["terraform", "init", "-input=false", "-no-color"],
            cwd=path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result_init.returncode == 0:
            print("✅ terraform init erfolgreich")
        else:
            print("❌ terraform init fehlgeschlagen")
            return False
    except Exception as e:
        print(f"Fehler beim Ausführen von terraform init: {e}")
        return False

    # terraform validate
    try:
        print("Check terraform validate...")
        result_validate = subprocess.run(
            ["terraform", "validate", "-no-color"],
            cwd=path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result_validate.returncode == 0:
            print("✅ terraform validate erfolgreich")
            return True
        else:
            print("❌ terraform validate fehlgeschlagen")
            return False
    except Exception as e:
        print(f"Fehler beim Ausführen von terraform validate: {e}")
        return False


def get_dirs(base_path):
    dir_list = [os.path.join(base_path, name) for name in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, name))]
    return dir_list

def main():
    working_l = []
    not_working_l = []
    os.makedirs(os.path.join(START_PATH, 'zzz_not_working'), exist_ok=True)
    
    l = get_dirs(START_PATH)
    print(f"Count to check: {len(l)}")
    
    for i in range(len(l)):
        print(f"Left to check: {len(l) - i}")
        print(f"Checking: {l[i]}")
        r = terrform_command(os.path.join(l[i], 'terraform'))
        if r == False:
            shutil.move(l[i], os.path.join(START_PATH, 'zzz_not_working'))



if __name__ == "__main__":
    main()