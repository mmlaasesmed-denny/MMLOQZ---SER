#!/bin/bash
# Script to deploy code and database to the production server

set -e

# Configuration
REMOTE_HOST="206.189.20.29"
REMOTE_USER="denny"
SSH_KEY="~/.ssh/gh_deploy_key"
REMOTE_DIR="/home/denny/djangoprojectdir"

echo "============================================="
echo "       DEPLOYING TO PRODUCTION SERVER        "
echo "============================================="

# 1. Push to GitHub first to ensure latest code is deployed
echo "[1/4] Pushing latest changes to GitHub..."
./deploy_to_github.sh

# 2. Take remote database backup on the production server (both timestamped and latest)
echo "[2/4] Backing up remote production database (versioned backup)..."
ssh -n -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
  mkdir -p $REMOTE_DIR/django_backend/backups && \
  BACKUP_FILE=\"$REMOTE_DIR/django_backend/backups/db.sqlite3.backup_\$(date '+%Y%m%d_%H%M%S')\" && \
  if [ -f $REMOTE_DIR/django_backend/db.sqlite3 ]; then \
    cp $REMOTE_DIR/django_backend/db.sqlite3 \$BACKUP_FILE && \
    cp $REMOTE_DIR/django_backend/db.sqlite3 $REMOTE_DIR/django_backend/db.sqlite3.backup_latest && \
    echo \"Backup saved to: \$(basename \$BACKUP_FILE)\"; \
  else \
    echo 'No database found to backup.'; \
  fi
"

# 3. Upload local database to the production server (Optional)
UPLOAD_DB=false
for arg in "$@"; do
  if [ "$arg" = "--with-db" ]; then
    UPLOAD_DB=true
  fi
done

if [ "$UPLOAD_DB" = true ]; then
  echo -e "\nWARNING: You are about to overwrite the active production database with your local database."
  read -p "Are you absolutely sure you want to replace it? (y/N) " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "[3/4] Uploading local SQLite database to server..."
    scp -i $SSH_KEY django_backend/db.sqlite3 $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/django_backend/db.sqlite3
  else
    echo "[3/4] Database upload cancelled. Skipping database copy."
  fi
else
  echo "[3/4] Skipping database upload (run with --with-db to upload database)."
fi

# 4. Upload frontend assets and restart server
echo "[4/4] Uploading frontend assets directly to server and restarting..."
scp -i $SSH_KEY -r django_backend/static/assets $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/django_backend/static/
scp -i $SSH_KEY django_backend/templates/index.html $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/django_backend/templates/index.html
ssh -n -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "sudo systemctl restart gunicorn"

echo "============================================="
echo "     PRODUCTION DEPLOYMENT COMPLETED         "
echo "============================================="

# 5. Verify sync status
echo "Verifying local vs production sync status..."
python3 verify_sync.py
