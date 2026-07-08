#!/bin/bash
# Automatically navigate to backend folder
cd "/Users/sunildennis/antigravity/Visual-Website-Builder/django_backend"

echo "Creating python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing required python packages..."
pip install django djangorestframework django-cors-headers

echo "Running migrations..."
python manage.py makemigrations cms_app
python manage.py migrate

echo "Seeding default data..."
python seed_database.py

echo "Starting Django server on port 8000..."
python manage.py runserver 8000
