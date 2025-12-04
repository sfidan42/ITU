#!/bin/bash
cd /app
sleep 1
python3 manage.py makemigrations mainpage_app
python3 manage.py migrate
python3 manage.py shell < database_entries.py
python3 manage.py runserver 0.0.0.0:8000