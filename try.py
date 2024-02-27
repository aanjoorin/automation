import os
import shutil
import subprocess
import requests

repo_name = "KPIP"

def create_github_repository(GITHUB_TOKEN, repo_name):
    base_url = "https://github..com/api/v3/repos/la"  # Adjust

    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "name": f"{repo_name}",
        "auto_init": False,
        "private": False
    }
    response = requests.post(base_url, headers=headers, json=data)

    if response.status_code == 201:
        print(f"Repository '{repo_name}' created successfully!")
    else:
        print(f"Failed to create repository. Status code: {response.status_code}")
        print(response.text)

def cleanup_temporary_directory(directory):
    try:
        shutil.rmtree(directory)
        print(f"Temporary directory '{directory}' removed successfully.")
    except Exception as e:
        print(f"Error removing temporary directory '{directory}': {e}")

subprocess.run(["git", "clone", f"https://github.com/gov/{repo_name}.git"])

os.chdir(f"{repo_name}")

# Create necessary directories and files
os.makedirs(".github/workflows/", exist_ok=True)
open(".github/workflows/main.yml", "w").close()
open("catalog-info.yaml", "w").close()

# Add content to main.yml
action_content = """
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Run a Script
        run: echo Hello, World!
"""

with open(".github/workflows/main.yml", "w") as action_file:
    action_file.write(action_content)

GITHUB_TOKEN = input("Input Github PAT: ")
TOKEN_LENGTH = len(GITHUB_TOKEN)
HIDDEN_TOKEN = "*" * TOKEN_LENGTH
print(f"GITHUB_TOKEN {HIDDEN_TOKEN} has been inputted.")

create_github_repository(GITHUB_TOKEN, repo_name)

# Rename the default branch locally
subprocess.run(["git", "branch", "-M", "main"])

# Push the updated repository content to the newly created repository
subprocess.run(["git", "add", "-A"])
subprocess.run(["git", "commit", "-m", "Initial commit"])
subprocess.run(["git", "remote", "add", "gh", f"https://github.serge.com/la/{repo_name}.git"])
subprocess.run(["git", "push", "-u", "gh", "main"])  # Push to the 'main' branch

# Clean up temporary directory
cleanup_temporary_directory(os.path.abspath(os.path.join(os.getcwd(), os.pardir, repo_name)))
