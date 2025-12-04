.PHONY: up down re start stop

up:
	docker compose -f docker-compose.yml up -d --build
	docker image prune -f

down:
	docker compose -f docker-compose.yml down --volumes --rmi all

start:
	docker compose -f docker-compose.yml up -d

stop:
	docker compose -f docker-compose.yml down

re: down up