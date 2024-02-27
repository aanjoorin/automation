import os
import shutil
import subprocess
import requests

def clone_gitlab_repo(GITLAB_URL, clone_dir):
    try:
        subprocess.run(["git", "clone", "--mirror", GITLAB_URL, clone_dir], check=True)
        print("GitLab repository cloned successfully.")
    except subprocess.CalledProcessError as e:
        print("Error cloning GitLab repository:", e)
        exit(1)

def create_github_repo(GITHUB_TOKEN, GITHUB_USERNAME, repo_name):
    github_api_url = f"https://api.github.com/user/repos"
    github_repo_data = {
        "name": repo_name,
        "private": False
    }
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    response = requests.post(github_api_url, headers=headers, json=github_repo_data)
    if response.status_code == 201:
        print(f"GitHub repository '{repo_name}' created successfully.")
    else:
        print("Failed to create GitHub repository.")
        print(response.text)
        exit(1)

def push_to_github(clone_dir, GITHUB_USERNAME, GITHUB_TOKEN, repo_name):
    github_repo_url = f"https://{GITHUB_USERNAME}:{GITHUB_TOKEN}@github.com/{GITHUB_USERNAME}/{repo_name}.git"
    try:
        subprocess.run(["git", "-C", clone_dir, "remote", "add", "github", github_repo_url], check=True)
        print("GitHub remote added successfully.")
    except subprocess.CalledProcessError as e:
        print("Error adding GitHub remote:", e)
        exit(1)
    try:
        subprocess.run(["git", "-C", clone_dir, "push", "--mirror", "github"], check=True)
        print("Repository successfully pushed to GitHub.")
    except subprocess.CalledProcessError as e:
        print("Error pushing repository to GitHub:", e)
        exit(1)

# GitLab repository URL and GitHub access token
GITLAB_URL = "https://gitlab.com/aanjoorin/KPIP.git"
GITHUB_USERNAME = "aanjoorin"
GITHUB_TOKEN = input("Input Github PAT: ")
TOKEN_LENGTH = len(GITHUB_TOKEN)
HIDDEN_TOKEN = "*" * TOKEN_LENGTH

# Extract repository name from GitLab URL
repo_name = os.path.basename(GITLAB_URL).split(".git")[0]

# Directory to clone the GitLab repository
clone_dir = "temp_repo"

# Clone the GitLab repository
clone_gitlab_repo(GITLAB_URL, clone_dir)

# Create repository on GitHub
create_github_repo(GITHUB_TOKEN, GITHUB_USERNAME, repo_name)

# Push to GitHub
push_to_github(clone_dir, GITHUB_USERNAME, GITHUB_TOKEN, repo_name)

# Clean up
shutil.rmtree(clone_dir)