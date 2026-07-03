#!/usr/bin/env python
"""
Django CMS Seeder Script
========================
This standalone script populates your Django database with 5 distinct CRM/CMS
pages containing different quantities of textual and visual fields across
multiple relational models in 'cms_app' (CMSPage, PageTextBlock, PageImageBlock, PageButtonAction).

INSTRUCTIONS:
1. Make sure Django dependencies are installed:
   pip install django djangorestframework django-cors-headers
2. Run migrations to ensure your SQL database tables exist:
   python manage.py migrate
3. Populate the pages in your database by running:
   python seed_database.py
"""

import os
import sys
import django

def seed_data():
    print("Initializing Django CMS seeder tool...")
    
    # 1. Setup Django standalone environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
    try:
        django.setup()
    except Exception as e:
        print("\n[!] Django Setup Error: Ensure you have run 'django-admin' or configured your env.")
        print(f"Error Details: {e}\n")
        return

    # Safe import local models inside the runner
    try:
        from cms_app.models import CMSPage, PageTextBlock, PageImageBlock, PageButtonAction
        db_ready = True
    except ImportError as ie:
        print(f"[!] Import Error: Failed to find cms_app.models. Check your system paths. {ie}")
        return

    # Define the 5 pre-cooked CMS Pages with varying multi-model configurations
    pages_data = [
        {
            "title": "Home Creative Workspace",
            "slug": "home-page",
            "description": "Studio Arch primary landing page.",
            "texts": [
                {"content": "STUDIO.ARCH", "size": "20px", "weight": "800", "color": "#0F172A", "order": 0, "align": "left"},
                {"content": "We craft structures with purposeful intent.", "size": "44px", "weight": "800", "color": "#0F172A", "order": 1, "align": "center"},
                {"content": "Copenhagen based visual design studio. We integrate high craftsmanship, light density, and architectural honesty directly into public and private spaces.", "size": "15px", "weight": "400", "color": "#475569", "order": 2, "align": "center"},
                {"content": "\"Simplicity is not the lack of clutter, but the presence of clarity.\"", "size": "22px", "weight": "500", "color": "#334155", "order": 4, "align": "center"}
            ],
            "images": [
                {"url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", "alt_text": "Modern Architecture showcase", "order": 3}
            ],
            "buttons": [
                {"label": "Browse Interactive Showcases", "url": "#portfolio", "bg": "#1E293B", "text_color": "#FFFFFF", "order": 5}
            ]
        },
        {
            "title": "Artisanal Pastry Bistro",
            "slug": "bistro-menu",
            "description": "Organic bakery items catalog.",
            "texts": [
                {"content": "MÈRE ROCHELLE BAKERY", "size": "24px", "weight": "800", "color": "#3C1E0A", "order": 0, "align": "center"},
                {"content": "PARISIAN TRADITIONS • ENTIRELY ORGANIC INGREDIENTS", "size": "11px", "weight": "700", "color": "#9A3412", "order": 1, "align": "center"},
                {"content": "01 / Sourdough Baguette ($6.50)", "size": "18px", "weight": "700", "color": "#3C1E0A", "order": 2, "align": "left"},
                {"content": "Fermented for a slow 36 hours for crisp, dark crust and highly hydrated internal texture.", "size": "13px", "weight": "400", "color": "#5E514D", "order": 3, "align": "left"},
                {"content": "02 / Golden Honey Croissant ($4.75)", "size": "18px", "weight": "700", "color": "#3C1E0A", "order": 4, "align": "left"},
                {"content": "Hand-rolled butter layers using high-fat grade milk and local wild blackberry glaze.", "size": "13px", "weight": "400", "color": "#5E514D", "order": 5, "align": "left"}
            ],
            "images": [
                {"url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", "alt_text": "Fresh organic bread on bench", "order": 6}
            ],
            "buttons": [
                {"label": "Reserve Fresh Morning Basket", "url": "/order", "bg": "#7C2D12", "text_color": "#FFFFFF", "order": 7}
            ]
        },
        {
            "title": "Technical SaaS Cloud Page",
            "slug": "saas-cloud",
            "description": "Fast database performance landing.",
            "texts": [
                {"content": "INTRODUCING PLATFORM v2.8", "size": "12px", "weight": "700", "color": "#4F46E5", "order": 0, "align": "center"},
                {"content": "Fast database queries with zero configuration operations.", "size": "36px", "weight": "800", "color": "#1F2937", "order": 1, "align": "center"},
                {"content": "99.997% latency isolation guaranteed on multi-region shards routing.", "size": "15px", "weight": "600", "color": "#4F46E5", "order": 3, "align": "center"},
                {"content": "Global round-trip database queries response, cache synchronized with your local application memory.", "size": "13px", "weight": "400", "color": "#64748B", "order": 4, "align": "center"}
            ],
            "images": [
                {"url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", "alt_text": "Secure database visual", "order": 2}
            ],
            "buttons": [
                {"label": "Create Free Sandbox Account", "url": "https://dashboard.service.io/signup", "bg": "#4F46E5", "text_color": "#FFFFFF", "order": 5}
            ]
        },
        {
            "title": "Creative Team Profiles",
            "slug": "about-team",
            "description": "Information about curators of modern space.",
            "texts": [
                {"content": "Meet the curators of modern architectural space.", "size": "32px", "weight": "700", "color": "#222222", "order": 0, "align": "center"},
                {"content": "We are designers, artisans and builders working inside a unified Danish workspace.", "size": "15px", "weight": "400", "color": "#5E514D", "order": 1, "align": "center"},
                {"content": "Our Collaborative Journey founded in Copenhagen in 2014, testing sustainable clay building blocks.", "size": "14px", "weight": "400", "color": "#5E514D", "order": 3, "align": "left"}
            ],
            "images": [
                {"url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", "alt_text": "Designers meeting in office", "order": 2}
            ],
            "buttons": [
                {"label": "Meet our specialists", "url": "/team", "bg": "#9A3412", "text_color": "#FFFFFF", "order": 4}
            ]
        },
        {
            "title": "Technical SLA Policy & Terms",
            "slug": "legal-terms",
            "description": "Standard terms of service agreement.",
            "texts": [
                {"content": "Standard License Agreement / Policy", "size": "32px", "weight": "800", "color": "#0F172A", "order": 0, "align": "left"},
                {"content": "Last modified: June 15, 2026", "size": "11px", "weight": "600", "color": "#64748B", "order": 1, "align": "left"},
                {"content": "By accessing this platform database and sync module, you acknowledge that all visual components, CSS configurations, and JSON-based sections are stored securely inside your Python Django model server.\n\nAll exported files are royalty-free and available for full production distribution without prior authorization constraints.", "size": "14px", "weight": "400", "color": "#334155", "order": 2, "align": "left"}
            ],
            "images": [],
            "buttons": []
        }
    ]

    print("\n-------------------------------------------------------------")
    for page_item in pages_data:
        print(f"[*] Processing page: '{page_item['title']}' (slug: /{page_item['slug']})")
        
        try:
            # Get or create CMS Page
            page, created = CMSPage.objects.get_or_create(
                slug=page_item["slug"],
                defaults={"title": page_item["title"], "description": page_item["description"]}
            )
            if not created:
                # Clean up old blocks to re-seed fresh values
                page.text_blocks.all().delete()
                page.image_blocks.all().delete()
                page.button_blocks.all().delete()
                page.title = page_item["title"]
                page.description = page_item["description"]
                page.save()
            
            # Seed related text blocks
            for t in page_item["texts"]:
                PageTextBlock.objects.create(
                    page=page,
                    content=t["content"],
                    font_size=t["size"],
                    font_weight=t["weight"],
                    text_align=t["align"],
                    color=t["color"],
                    sort_order=t["order"]
                )
            
            # Seed related image blocks
            for im in page_item["images"]:
                PageImageBlock.objects.create(
                    page=page,
                    image_url=im["url"],
                    alt_text=im["alt_text"],
                    sort_order=im["order"]
                )
            
            # Seed related button blocks
            for btn in page_item["buttons"]:
                PageButtonAction.objects.create(
                    page=page,
                    label=btn["label"],
                    destination_url=btn["url"],
                    bg_color=btn["bg"],
                    text_color=btn["text_color"],
                    sort_order=btn["order"]
                )
            print(f"    -> [SUCCESS] Saved! Added page + {len(page_item['texts'])} texts, {len(page_item['images'])} images, {len(page_item['buttons'])} buttons.")
        except Exception as ex:
            print(f"    -> [ERROR] Failed saving model instances to Django DB: {ex}")

    print("-------------------------------------------------------------")
    print("[SUCCESS] Seeding complete! Your local database files are fully loaded.")

if __name__ == '__main__':
    seed_data()
