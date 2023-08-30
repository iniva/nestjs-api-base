#!/bin/bash
DOCKER_COMPOSE_FILE=$PWD/docker/local/docker-compose.yml

DOCKER_BUILDKIT=1 docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api up --build --abort-on-container-exit --remove-orphans
