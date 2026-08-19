#!/bin/bash
# Dedicated Deployment Script for www.mmloqz.com on new server 212.237.249.17

set -e

REMOTE_HOST="212.237.249.17"
REMOTE_USER="root"
SSH_KEY="~/.ssh/gh_deploy_key"
REMOTE_DIR="/var/www/mmloqz_cms"

echo "============================================="
echo "  DEPLOYING TO MMLOQZ NEW SERVER (212.237.249.17)  "
echo "============================================="

# 1. Build frontend assets
echo "[1/4] Building frontend production bundle..."
npm run build

echo "Syncing build assets to Django static & template folders..."
rm -rf django_backend/static/assets/*
mkdir -p django_backend/static/assets/
cp -r dist/assets/* django_backend/static/assets/
cp dist/index.html django_backend/templates/index.html

# 2. Sync code with GitHub repo (mmlaasesmed-denny/MMLOQZ---SER.git)
echo "[2/4] Syncing codebase to GitHub repository MMLOQZ---SER..."
git add -A
if ! git diff-index --quiet HEAD --; then
    git commit -m "Deploy update for mmloqz.com: $(date '+%Y-%m-%d %H:%M:%S')"
fi

GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=no" git push mmloqz-ser main --force || {
    echo "Warning: Could not push to mmloqz-ser remote via SSH key. Ensure deploy key is added to GitHub repo settings."
}

# 3. Setup Remote Production Directory & Server Files
echo "[3/4] Deploying assets to new server $REMOTE_HOST in $REMOTE_DIR..."
ssh -n -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_DIR/django_backend $REMOTE_DIR/dist $REMOTE_DIR/src"

scp -i $SSH_KEY -r src/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/src/
scp -i $SSH_KEY -r dist/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/dist/
scp -i $SSH_KEY -r django_backend/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/django_backend/

# 4. Initialize Fresh Database & Restart Service
echo "[4/4] Setting up Python virtual environment & fresh Django CMS database..."
ssh -n -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "
  cd $REMOTE_DIR/django_backend && \
  if [ ! -d \"../dprojectenv\" ]; then \
    python3 -m venv ../dprojectenv; \
  fi && \
  source ../dprojectenv/bin/activate && \
  pip install -r requirements.txt 2>/dev/null || true && \
  python manage.py migrate --noinput && \
  python manage.py collectstatic --noinput && \
  sudo systemctl restart gunicorn-mmloqz 2>/dev/null || sudo systemctl restart gunicorn 2>/dev/null || true
"

echo "============================================="
echo "   MMLOQZ.COM DEPLOYMENT COMPLETED!          "
echo "============================================="
