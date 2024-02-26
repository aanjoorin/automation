import os
import shutil
import subprocess
import requests

# Clone the repository
subprocess.run(["git", "clone", "https://github.com/CDCgov/BESS.git"])

# Navigate into the cloned repository
os.chdir("BESS")

# Create necessary directories and files
os.makedirs(".github/workflows/", exist_ok=True)
open(".github/workflows/main.yml", "w").close()
open("catalog-info.yaml", "w").close()

# Add content to the main.yml file
action_content = """
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Run a one-line script
        run: echo Hello, world!
"""
with open(".github/workflows/main.yml", "w") as action_file:
    action_file.write(action_content)

# Create a new repository under github.com/aanjoorin
GITHUB_TOKEN = "GITHUB_TOKEN"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}
data = {
    "name": "BESS",
    "auto_init": False,  # Initialize with a README file
    "private": False    # Set to True for private repository
}
response = requests.post("https://api.github.com/user/repos", headers=headers, json=data)

if response.status_code == 201:
    print("Repository 'BESS' created successfully under 'aanjoorin'!")
else:
    print(f"Failed to create repository. Status code: {response.status_code}")
    print(response.text)

# Push the updated repository content to the newly created repository
subprocess.run(["git", "add", "-A"])
subprocess.run(["git", "commit", "-m", "Initial commit"])
subprocess.run(["git", "remote", "add", "gh", f"https://github.com/aanjoorin/BESS.git"])
subprocess.run(["git", "push", "-u", "gh", "master"])
