.PHONY: test

test:
	npm run test

up-dev:
	npm run start:dev

up-prod:
	docker compose up -d


