#!/bin/bash

# Function to clone GitLab repository
clone_gitlab_repo() {
    GITLAB_URL=$1
    CLONE_DIR=$2
    git clone --mirror "$GITLAB_URL" "$CLONE_DIR"
    if [ $? -eq 0 ]; then
        echo "GitLab repository cloned successfully."
    else
        echo "Error cloning GitLab repository."
        exit 1
    fi
}

# Function to create GitHub repository
create_github_repo() {
    GITHUB_TOKEN=$1
    GITHUB_USERNAME=$2
    REPO_NAME=$3
    GITHUB_API_URL="https://api.github.com/user/repos"
    DATA="{\"name\": \"$REPO_NAME\", \"private\": false}"
    RESPONSE=$(curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -d "$DATA" "$GITHUB_API_URL")
    if [ "$(echo "$RESPONSE" | jq -r '.id')" != null ]; then
        echo "GitHub repository '$REPO_NAME' created successfully."
    else
        echo "Failed to create GitHub repository."
        echo "$RESPONSE"
        exit 1
    fi
}

# Function to push to GitHub
push_to_github() {
    CLONE_DIR=$1
    GITHUB_USERNAME=$2
    GITHUB_TOKEN=$3
    REPO_NAME=$4
    GITHUB_REPO_URL="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    cd "$CLONE_DIR"
    git remote add github "$GITHUB_REPO_URL"
    git push --mirror github
    if [ $? -eq 0 ]; then
        echo "Repository successfully pushed to GitHub."
    else
        echo "Error pushing repository to GitHub."
        exit 1
    fi
}

# # Function to clean up
# cleanup() {
#     CLONE_DIR=$1
#     rm -rf "$CLONE_DIR"
# }

# # Main script starts here

# GitLab repository URL and GitHub access token
GITLAB_URL="https://gitlab.com/aanjoorin/KPIP.git"
GITHUB_USERNAME="aanjoorin"
echo -n "Input GitHub PAT: "
read -s GITHUB_TOKEN
echo

# Extract repository name from GitLab URL
REPO_NAME=$(basename "$GITLAB_URL" | sed 's/\.git$//')

# Directory to clone the GitLab repository
CLONE_DIR="temp_repo"

# Clone the GitLab repository
clone_gitlab_repo "$GITLAB_URL" "$CLONE_DIR"

# Create repository on GitHub
create_github_repo "$GITHUB_TOKEN" "$GITHUB_USERNAME" "$REPO_NAME"

# Push to GitHub
push_to_github "$CLONE_DIR" "$GITHUB_USERNAME" "$GITHUB_TOKEN" "$REPO_NAME"

# Function to clean up
rm -rf /temp_repo