#!/bin/bash

DOCKER_BUILDKIT=1 docker-compose -p nestjs-api up --build --abort-on-container-exit --remove-orphans
