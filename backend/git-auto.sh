#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Error: No commit message provided."
  echo "Usage: ./git-automation.sh \"Your commit message\""
  exit 1
fi

# Add all changes
git add -A

# Commit with the provided message
git commit -m "$1"

# Push to the main branch
git push -u origin main
