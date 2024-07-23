#!/bin/bash

# This helps run integration tests locally
LOCAL_ENV_FILE="${PWD}/.env"
if [ -f "$LOCAL_ENV_FILE" ]; then
  echo "Found $LOCAL_ENV_FILE. Loading values."

  export $(grep -v '^#' $LOCAL_ENV_FILE | xargs)
fi

DOCKER_COMPOSE_FILE=$PWD/docker/test-integration/docker-compose.yaml

DOCKER_BUILDKIT=1 docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base build
DOCKER_BUILDKIT=1 docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base up --force-recreate --renew-anon-volumes --abort-on-container-exit

# Detect exit code of the "tester" service in docker-compose
CODE=$(docker inspect $(docker ps -a | grep nestjs-api-base-tester | awk '{print $1}') | jq '.[0].State.ExitCode')

docker compose -f $DOCKER_COMPOSE_FILE -p nestjs-api-base down -v

exit $CODE
