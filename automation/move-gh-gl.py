import os
import shutil
import subprocess
import requests
import time

# GitHub repository URL
username = "aanjoorin"
repository = "KPIP"
github_repo_url = f"https://github.com/{username}/{repository}.git"

# GitLab API endpoint
gitlab_api_url = "https://gitlab.com/api/v4/projects"

# GitLab access token
gitlab_access_token = "GITLAB_TOKEN"


# Directory to clone the GitHub repository
clone_dir = "temp_repo"

try:
    # Clone the GitHub repository
    subprocess.run(["git", "clone", "--mirror", github_repo_url, clone_dir], check=True)
except subprocess.CalledProcessError as e:
    print("Error cloning GitHub repository:", e)
    exit(1)

# Extract repository name from GitHub URL
github_repo_name = os.path.basename(github_repo_url).split(".git")[0]

# Create GitLab repository data
gitlab_repo_data = {
    "name": github_repo_name,
    "visibility": "public"
}

# GitLab API request headers
headers = {
    "Authorization": f"Bearer {gitlab_access_token}",
    "Content-Type": "application/json"
}

# Send request to create GitLab repository
response = requests.post(gitlab_api_url, headers=headers, json=gitlab_repo_data)

# Check if the request was successful
if response.status_code == 201:
    print(f"GitLab repository '{github_repo_name}' created successfully and set to public!")
else:
    print("Failed to create GitLab repository:")
    print(response.text)
    exit(1)

# Add a brief delay to allow time for the repository to become fully available
time.sleep(10)

# Set GitLab remote URL (HTTPS)
gitlab_repo_url = f"https://gitlab.com/{username}/{github_repo_name}.git"

try:
    # Add GitLab remote
    subprocess.run(["git", "-C", clone_dir, "remote", "add", "gitlab", gitlab_repo_url], check=True)
except subprocess.CalledProcessError as e:
    print("Error adding GitLab remote:", e)
    exit(1)

try:
    # Push all branches and tags to GitLab
    subprocess.run(["git", "-C", clone_dir, "push", "--mirror", "gitlab"], check=True)
    print("All branches and tags successfully pushed to GitLab!")
except subprocess.CalledProcessError as e:
    print("Error pushing repository to GitLab:", e)
    exit(1)

# Clean up temporary directory
shutil.rmtree(clone_dir)
