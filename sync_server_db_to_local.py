import json
import sqlite3
import os

def sync_server_to_local_db():
    json_path = 'public/published_site.json'
    db_path = 'django_backend/db.sqlite3'

    if not os.path.exists(json_path):
        print(f"Error: {json_path} does not exist!")
        return

    if not os.path.exists(db_path):
        print(f"Error: {db_path} does not exist!")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        records = json.load(f)

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # Clear old local records
    c.execute("DELETE FROM cms_app_websitelayout")

    inserted = 0
    for r in records:
        rec_id = r.get('id')
        title = r.get('title', 'Untitled')
        sections_json = json.dumps(r.get('sections', []))
        theme_json = json.dumps(r.get('theme', {}))
        is_published = 1 if r.get('is_published', True) else 0
        created_at = r.get('created_at', '2026-08-25 00:00:00')
        updated_at = r.get('updated_at', '2026-08-25 00:00:00')

        c.execute("""
            INSERT INTO cms_app_websitelayout (id, title, sections, theme, is_published, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (rec_id, title, sections_json, theme_json, is_published, created_at, updated_at))
        inserted += 1

    conn.commit()
    conn.close()
    print(f"Successfully imported {inserted} server records into local SQLite database ({db_path})!")

if __name__ == '__main__':
    sync_server_to_local_db()
