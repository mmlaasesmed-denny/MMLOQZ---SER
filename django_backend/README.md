# 🐍 Python Django Backend CMS Project

This directory contains a **fully self-contained, pre-configured Django project** ready to run on your PC!

It includes the project configurations (`django_project`), Django's `manage.py`, a local CMS sub-application (`cms_app`), and an automated database seeder (`seed_database.py`) to instantly load all 5 visual builder pages into your local SQL database.

---

## 🚀 Quick Start Guide (Run on Your PC)

Follow these simple steps inside your computer's terminal:

### 1. Extract and Navigate
Download the `/django_backend` folder, export it, or download the full ZIP file of this workspace. Open your terminal and change directory to the project's root:
```bash
cd django_backend
```

### 2. Set Up a Python Virtual Environment (Highly Recommended)
Create and activate an isolated sandbox virtual environment to avoid package version clashes:

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate
```

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
Install the required packages to boot the database server and cross-origin query managers:
```bash
pip install django djangorestframework django-cors-headers
```

### 4. Create Database and Run Migrations
Run the standard migrations command to initialize your database structure inside a lightweight, lightning-fast local SQLite database file (`db.sqlite3`):
```bash
python manage.py makemigrations cms_app
python manage.py migrate
```

### 5. Seed the 5 Interconnected Pages Instantly! 🌱
Run our stand-alone seeder utility to populate all components, buttons, menus, and images for the 5 pages inside your SQLite tables:
```bash
python seed_database.py
```

### 6. Start the Server
Boot up the backend server:
```bash
python manage.py runserver 8000
```

Once running, visit **`http://127.0.0.1:8000/api/cms-pages/`** in your browser to see your seeded page contents in beautiful, formatted JSON presentation!

---

## 🗄️ Backend Architectures Included

We structured the sub-application `cms_app` with **three industry-standard database approaches** to fit your structural needs:

### 🟢 Approach A: Modern JSON Layout Document
*   **Model**: `WebsiteLayout`
*   **Endpoints**: `/api/layouts/`
*   **Best For**: Highly flexible visual interfaces. Saves your entire website columns, paddings and component elements as a nested JSON structure directly inside one database column. High performance, zero SQL table alteration overhead.

### 🔵 Approach B: Flat Polymorphic Blocks
*   **Models**: `DynamicPage` & `PageFieldBlock`
*   **Best For**: Sequential linear builders. Groups fields as related rows matching block tags.

### 🔴 Approach C: Relational Multi-Model CMS (Wordpress Style)
*   **Models**: `CMSPage`, `PageTextBlock`, `PageImageBlock`, `PageButtonAction`
*   **Endpoints**: `/api/cms-pages/`
*   **Best For**: Custom relational lookups, SQL analytics and rigorous database validations. Spreads contents across separate, distinct tables which are sequentially sorted at query time.

---

## 🛠️ Settings & CORS Already Configured!

The central settings file (`django_project/settings.py`) is already fully optimized:
- **`rest_framework`** & **`corsheaders`** are loaded in `INSTALLED_APPS`.
- **CORS CORS_ALLOW_ALL_ORIGINS** is set to `True` for easy debugging.
- **`APP_DIRS: True`** is defined inside the template rendering engine, resolving the common *"TemplateDoesNotExist rest_framework/api.html"* error out of the box!
- **`db.sqlite3`** is automatically generated in your root folder.
