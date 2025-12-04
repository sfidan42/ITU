.PHONY: up down re

up:
	docker compose -f docker-compose.yml up -d --build
	docker image prune -f

down:
	docker compose -f docker-compose.yml down --volumes --rmi all

re: down up