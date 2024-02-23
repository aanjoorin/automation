#!/bin/bash

# Clone the repository
git clone https://github.com/ken/BESS.git

# Navigate into the cloned repository
cd BESS || exit

# Create necessary directories and files
mkdir -p .github/workflows/
touch .github/workflows/main.yml
touch catalog-info.yaml

# Add content to the main.yml file
cat << EOF > .github/workflows/main.yml
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
EOF

# Create a new repository under github.com/la
# Assuming you have a GitHub token stored in the environment variable GITHUB_TOKEN
curl -X POST -H "Authorization: token $GITHUB_TOKEN" -d '{"name": "BESS"}' https://api.github.com/user/repos

# Push the updated repository content to the newly created repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/la/BESS.git
git push -u origin main
