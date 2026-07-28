#!/bin/bash
# Script to deploy code directly to GitHub

set -e

echo "============================================="
echo "       DEPLOYING TO GITHUB REPOSITORY        "
echo "============================================="

# 1. Build frontend assets
echo "Building frontend assets..."
npm run build

echo "Copying build assets to Django directories..."
rm -rf django_backend/static/assets/*
mkdir -p django_backend/static/assets/
cp -r dist/assets/* django_backend/static/assets/
cp dist/index.html django_backend/templates/index.html

# 2. Stage changes
echo "Staging all changes..."
git add -A

# 3. Check for modifications
if git diff-index --quiet HEAD --; then
    echo "No modifications found. GitHub repository is up-to-date."
else
    COMMIT_MSG="Sync update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Committing changes with message: '$COMMIT_MSG'..."
    git commit -m "$COMMIT_MSG"
fi

# 4. Push to GitHub
echo "Pushing changes to remote GitHub origin main..."
git push origin main

echo "============================================="
echo "    GITHUB DEPLOYMENT COMPLETED SUCCESSFULLY "
echo "============================================="
