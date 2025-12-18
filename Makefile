.PHONY: install dev build clean db-setup db-migrate db-studio docker-up docker-down docker-logs

# Install dependencies
install:
	npm install

# Development
dev:
	npm run dev:bot & npm run dev:webapp

# Build
build:
	npm run build

# Clean
clean:
	rm -rf node_modules backend/node_modules frontend/node_modules shared/node_modules
	rm -rf backend/dist frontend/dist shared/dist

# Database setup
db-setup:
	npm run db:generate
	npm run db:migrate

db-migrate:
	npm run db:migrate

db-studio:
	npm run db:studio

# Docker
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build

docker-restart:
	docker-compose restart

# Production deploy
deploy:
	docker-compose build
	docker-compose up -d
	docker-compose exec backend npm run db:deploy



