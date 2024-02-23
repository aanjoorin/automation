#!/bin/bash
username="aanjoorin"
repository="KPIP"
github_repo_url="https://github.com/$username/$repository.git"
gitlab_api_url="https://gitlab.com/api/v4/projects"
# Directory to clone the GitHub repository
clone_dir="temp_repo"
git clone --mirror "$github_repo_url" "$clone_dir" || { echo "Error cloning GitHub repository"; exit 1; }
# Extract repository name from GitHub URL
github_repo_name=$(basename -s .git "$github_repo_url")
# Create GitLab repository data
gitlab_repo_data=$(cat <<EOF
{
  "name": "$github_repo_name",
  "visibility": "public"
}
EOF
)

# Send request to create GitLab repository
response=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $gitlab_access_token" -d "$gitlab_repo_data" "$gitlab_api_url")

# Check if the request was successful
gitlab_repo_id=$(echo "$response" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
if [[ $gitlab_repo_id ]]; then
    echo "GitLab repository '$github_repo_name' created successfully and set to public!"
else
    echo "Failed to create GitLab repository:"
    echo "$response"
    exit 1
fi

sleep 10

gitlab_repo_url="https://gitlab.com/$username/$github_repo_name.git"
git -C "$clone_dir" remote add gitlab "$gitlab_repo_url" || { echo "Error adding GitLab remote"; exit 1; }
git -C "$clone_dir" push --mirror gitlab || { echo "Error pushing repository to GitLab"; exit 1; }
rm -rf "$clone_dir"