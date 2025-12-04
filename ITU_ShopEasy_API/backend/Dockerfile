# Use slim Python base
FROM python:slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Expose port for Django
EXPOSE 8000

# Default command (overridden in docker-compose for migrations & runserver)
# CMD ["python3","manage.py","makemigrations"]
# CMD ["python3","manage.py","migrate"]
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
COPY ./script.sh /script.sh
#COPY ./requirements.txt /requirements.txt
RUN chmod +x /script.sh
RUN pip install django psycopg2-binary djangorestframework
ENTRYPOINT ["bash", "/script.sh"]

CMD ["sleep", "infinity"]