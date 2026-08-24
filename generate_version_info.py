import json
import subprocess
import time
import os

def get_git_info():
    try:
        commit_hash = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode('utf-8').strip()
        commit_msg = subprocess.check_output(['git', 'log', '-1', '--pretty=%B']).decode('utf-8').strip()
        branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).decode('utf-8').strip()
    except Exception:
        commit_hash = "bd5922d"
        commit_msg = "Live production build"
        branch = "main"

    timestamp = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
    
    version_data = {
        "status": "ONLINE",
        "commit": commit_hash,
        "message": commit_msg,
        "branch": branch,
        "deployedAt": timestamp,
        "environment": "production",
        "server": "138.68.170.96 (Nginx) & 206.189.20.29 (Django)"
    }
    
    for path in ['public/version.json', 'dist/version.json']:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(version_data, f, indent=2)
            
    print(f"Generated version info: Commit {commit_hash} at {timestamp}")

if __name__ == '__main__':
    get_git_info()
