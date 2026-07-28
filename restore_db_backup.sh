#!/bin/bash
# Emergency database restore script.
# Lists backups on the production server and lets you restore one.

set -e

# Configuration
REMOTE_HOST="206.189.20.29"
REMOTE_USER="denny"
SSH_KEY="~/.ssh/gh_deploy_key"
REMOTE_DIR="/home/denny/djangoprojectdir"

echo "============================================="
echo "   EMERGENCY DATABASE RESTORE ON PRODUCTION  "
echo "============================================="

echo "Connecting to production server to list backups..."
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "
  echo 'Available backups on the server:'
  ls -lh $REMOTE_DIR/django_backend/backups/db.sqlite3.backup_* 2>/dev/null || echo 'No backups found.'
"

echo -e "\nPlease copy and paste the full path of the backup file you want to restore:"
read -p "Backup File Path: " BACKUP_PATH

if [ -z "$BACKUP_PATH" ]; then
  echo "Error: No backup path provided. Exiting."
  exit 1
fi

echo -e "\nWARNING: You are about to restore:"
echo "  $BACKUP_PATH"
echo "to the active production database."
read -p "Are you sure? (y/N) " CONFIRM

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Restoring database on production..."
  ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "
    cd $REMOTE_DIR/django_backend && \
    cp db.sqlite3 db.sqlite3.pre_restore_backup && \
    cp \"$BACKUP_PATH\" db.sqlite3 && \
    echo 'Active database replaced. Restarting server...' && \
    bash $REMOTE_DIR/deploy.sh
  "
  echo "Database successfully restored!"
else
  echo "Restore cancelled."
fi
echo "============================================="
