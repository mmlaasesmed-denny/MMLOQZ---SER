#!/bin/bash
# Script to rollback the latest deployment to production and GitHub

set -e

# Configuration
REMOTE_HOST="206.189.20.29"
REMOTE_USER="denny"
SSH_KEY="~/.ssh/gh_deploy_key"
REMOTE_DIR="/home/denny/djangoprojectdir"

SPECIFIC_BACKUP=$1

echo "============================================="
echo "       ROLLING BACK LATEST DEPLOYMENT        "
echo "============================================="

# 1. Revert Git commit
echo "[1/4] Reverting latest git commit..."
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    echo "Error: Must be on main branch to perform rollback."
    exit 1
fi

# Revert latest commit (creates a new commit that undoes the previous changes)
git revert --no-edit HEAD
echo "Latest commit has been reverted locally."

# 2. Push revert to GitHub
echo "[2/4] Pushing revert commit to GitHub..."
git push origin main

# 3. Restore the backup database on production server
echo "[3/4] Restoring remote production database..."
if [ -n "$SPECIFIC_BACKUP" ]; then
  echo "Restoring to specific backup version: db.sqlite3.backup_$SPECIFIC_BACKUP"
  ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
    BACKUP_PATH=\"$REMOTE_DIR/django_backend/backups/db.sqlite3.backup_$SPECIFIC_BACKUP\"
    if [ -f \$BACKUP_PATH ]; then
      cp \$BACKUP_PATH $REMOTE_DIR/django_backend/db.sqlite3
      echo 'Remote database restored successfully to db.sqlite3.backup_$SPECIFIC_BACKUP!'
    else
      echo \"Error: Backup file \$BACKUP_PATH not found.\"
      exit 1
    fi
  "
else
  echo "Restoring to latest backup..."
  ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
    if [ -f $REMOTE_DIR/django_backend/db.sqlite3.backup_latest ]; then
      cp $REMOTE_DIR/django_backend/db.sqlite3.backup_latest $REMOTE_DIR/django_backend/db.sqlite3
      echo 'Remote database restored successfully to latest backup!'
    else
      echo 'Warning: No backup file db.sqlite3.backup_latest found on the server.'
    fi
  "
fi

# 4. Trigger remote deploy on server to pull the git revert commit
echo "[4/4] Triggering remote server deploy to pull revert..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "bash $REMOTE_DIR/deploy.sh"

echo "============================================="
echo "        ROLLBACK COMPLETED SUCCESSFULLY      "
echo "============================================="

# 5. Verify sync status
echo "Verifying local vs production sync status..."
python3 verify_sync.py
