#!/bin/sh
# wait-for-db.sh
# This script waits for a MySQL database to be available before executing a command.
# It checks the availability of the database by attempting to connect to it on port 3306.

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Waiting for MySQL at $host:3306..."
  sleep 1
done

exec $cmd