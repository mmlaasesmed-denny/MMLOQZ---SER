#!/bin/bash
# Pulls the active production database to your local workspace.

set -e

# Configuration
REMOTE_HOST="206.189.20.29"
REMOTE_USER="denny"
SSH_KEY="~/.ssh/gh_deploy_key"
REMOTE_DIR="/home/denny/djangoprojectdir"

echo "============================================="
# Backup local database first before pulling
if [ -f django_backend/db.sqlite3 ]; then
  echo "Backing up local database to django_backend/db.sqlite3.local_backup..."
  cp django_backend/db.sqlite3 django_backend/db.sqlite3.local_backup
fi

echo "Pulling production database from server..."
scp -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/django_backend/db.sqlite3" django_backend/db.sqlite3

echo "Production database successfully pulled to local workspace!"
echo "============================================="
