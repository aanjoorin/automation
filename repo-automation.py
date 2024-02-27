import os
import shutil
import subprocess
import requests

#Variables
base_url = "https://github.boozallencsn.com/api/v3"
repo_url = f"{base_url}/user/repos"
repo_name = "KPIP"

subprocess.run(["git", "clone", f"https://github.com/CDCgov/{repo_name}.git"])

os.chdir(f"{repo_name}")

#Create neccessary directories and files
os.makedirs(".github/workflows/", exist_ok=True)
open(".github/workflows/main.yml", "w").close()
open("catalog-info.yaml", "w").close()

#Add content to main.yml
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
print(f"GITHUB_TOKEN {HIDDEN_TOKEN} has been inputed.")

headers = {
    "Authorization": f"token" "{GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}
data = {
    "name": f"{repo_name}",
    "auto_init": "False",
    "private": "False"
}

response = requests.post(repo_url, headers=headers, json=data)

if response.status_code == 201:
    print(f"Repository '{repo_name}' created successfully!")
else:
    print(f"Failed to create repository. Status code: {response.status_code}")
    print(response.text)

# Push the updated repository content to the newly created repository
subprocess.run(["git", "add", "-A"])
subprocess.run(["git", "commit", "-m", "Initial commit"])
subprocess.run(["git", "remote", "add", "gh", f"https://github.boozallencsn.com/Anjoorin-Ademiju/{repo_name}.git"])
subprocess.run(["git", "push", "-u", "gh", "master"])
