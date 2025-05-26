# The purpose of this scrip ist delete duplicates in and across the folders

import os
import shutil 

source_dirs = [
    "terraform_data/aws",
    "terraform_data/azure",
    "terraform_data/gcp"
]

aws_names = []

# Get all names in dir
def get_repos(path):
    l = []
    for name in os.listdir(path):
        if os.path.isdir(os.path.join(path, name)):
            l.append(name)
    return l

def compare_and_delete(source_path, compare_path):
    source_repos = get_repos(source_path)
    compare_repos = get_repos(compare_path)
    to_delete = []

    for s in source_repos:
        for c in compare_repos:
            if s == c:
                to_delete.append(c)

    print(f"Found duplicates: {len(to_delete)}")
    if len(to_delete) > 0:
            for f in to_delete: 
                p = os.path.join(compare_path, f)
                shutil.rmtree(p)
                print(f"Deleted: {p}")


def main():
    for i in source_dirs:
        for j in source_dirs:
            if i == j:
                continue

            print(f"Compare {i} with {j}")
            compare_and_delete(i,j)

if __name__ == "__main__": 
    main()
