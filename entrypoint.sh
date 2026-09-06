#!/bin/sh
set -e

node /app/seed-db.mjs /app/seed/guests.json

exec "$@"
