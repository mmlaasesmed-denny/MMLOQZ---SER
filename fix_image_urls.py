import os
import sqlite3
import json

replacements = {
    "https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/logo.png": "/images/logo.png",
    "https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/Hero.webp": "/images/Hero.webp",
    "https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/MMloqz%20products%20image.webp": "/images/MMloqz%20products%20image.webp",
    "https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/MMloqz products image.webp": "/images/MMloqz%20products%20image.webp"
}

# 1. Replace in codebase files
for root, dirs, files in os.walk("/Users/sunildennis/antigravity/Visual-Website-Builder/src"):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            modified = False
            for k, v in replacements.items():
                if k in content:
                    content = content.replace(k, v)
                    modified = True
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed image URLs in {filepath}")

for filepath in ["/Users/sunildennis/antigravity/Visual-Website-Builder/public/published_site.json"]:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        modified = False
        for k, v in replacements.items():
            if k in content:
                content = content.replace(k, v)
                modified = True
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed image URLs in {filepath}")

# 2. Fix local SQLite database
db_path = "/Users/sunildennis/antigravity/Visual-Website-Builder/django_backend/db.sqlite3"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, sections FROM cms_app_websitelayout")
    rows = cursor.fetchall()
    updated_count = 0
    for r in rows:
        lid, sec_str = r[0], r[1]
        if sec_str and isinstance(sec_str, str):
            modified = False
            for k, v in replacements.items():
                if k in sec_str:
                    sec_str = sec_str.replace(k, v)
                    modified = True
            if modified:
                cursor.execute("UPDATE cms_app_websitelayout SET sections = ? WHERE id = ?", (sec_str, lid))
                updated_count += 1
    conn.commit()
    conn.close()
    print(f"Updated {updated_count} records in local SQLite DB!")
