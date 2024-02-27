import os
import shutil
import subprocess
import requests

subprocess.run(["git", "clone", "https://github.com/CDCgov/KPIP.git"])

os.chdir("KPIP")

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

GITHUB_TOKEN = "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"

base_url = "https://github.boozallencsn.com/api/v3"
repo_url = f"{base_url}/user/repos"
headers = {
    "Authorization": f"token" "{GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}
data = {
    "name": "KPIP",
    "auto_init": "False",
    "private": "False"
}
#response = requests.post("https://api.github.com/user/repos", headers=headers, json=data)
#response = requests.post("https://api.github.boozallencsn.com/Anjoorin-Ademiju/repos", headers=headers, json=data)
response = requests.post(repo_url, headers=headers, json=data)

#https://github.boozallencsn.com/Anjoorin-Ademiju/KPIP.git


if response.status_code == 201:
    print("Repository 'KPIP' created successfully!")
else:
    print(f"Failed to create repository. Status code: {response.status_code}")
    print(response.text)

#Create a new repository in github
subprocess.run(["git", "init"])
subprocess.run(["git", "add", "-A"])
subprocess.run(["git", "commit", "-m", "Initial commit"])

# Push the updated repository content to the newly created repository
subprocess.run(["git", "remote", "add", "gh", f"https://github.boozallencsn.com/Anjoorin-Ademiju/KPIP.git"])
subprocess.run(["git", "push", "-u", "gh", "master"])