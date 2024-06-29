#!/bin/bash

# Load environment variables from .env file
set -o allexport
source ../.env
set +o allexport

# Start PostgreSQL container without SSL
docker run -d \
  --name mypostgres \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_PORT=$POSTGRES_PORT \
  -p $POSTGRES_PORT:5432 \
  postgres:latest
