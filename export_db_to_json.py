import sqlite3
import json
import os

db_path = "/Users/sunildennis/antigravity/Visual-Website-Builder/django_backend/db.sqlite3"
public_json = "/Users/sunildennis/antigravity/Visual-Website-Builder/public/published_site.json"
dist_json = "/Users/sunildennis/antigravity/Visual-Website-Builder/dist/published_site.json"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, sections, theme FROM cms_app_websitelayout ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    
    layouts = []
    for r in rows:
        try:
            sec = json.loads(r[2]) if isinstance(r[2], str) else r[2]
            thm = json.loads(r[3]) if isinstance(r[3], str) else r[3]
            layouts.append({
                "id": str(r[0]),
                "title": r[1],
                "sections": sec,
                "theme": thm
            })
        except Exception as e:
            pass
            
    print(f"Exported {len(layouts)} layout records from local SQLite db!")
    with open(public_json, 'w') as f:
        json.dump(layouts, f, indent=2)
    if os.path.exists(os.path.dirname(dist_json)):
        with open(dist_json, 'w') as f:
            json.dump(layouts, f, indent=2)
conn.close()
