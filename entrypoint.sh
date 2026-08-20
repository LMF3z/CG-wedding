#!/bin/sh
set -e

mkdir -p /app/data
node /app/sync-guests.mjs /app/seed/guests.json /app/data/guests.json

exec "$@"