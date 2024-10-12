#!/bin/bash
DOCKER_COMPOSE_FILE=$PWD/docker/test-integration/docker-compose.yml

DOCKER_BUILDKIT=1 docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base build
DOCKER_BUILDKIT=1 docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base up --force-recreate --renew-anon-volumes --abort-on-container-exit

# Detect exit code of the "tester" service in docker-compose
CODE=$(docker inspect $(docker ps -a | grep nestjs-api-base-tester | awk '{print $1}') | jq '.[0].State.ExitCode')

docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base down -v

exit $CODE
