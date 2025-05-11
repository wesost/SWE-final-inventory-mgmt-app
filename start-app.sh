#!/bin/bash

# File: start-app.sh
# Modified: 5/7/2025
#
# This is the main build script. Run this script from the root project directory to start the application.
# Call with argument --reset to remove volumes on start

if [[ "$1" == "--reset" ]]; then
  echo "Reset flag detected: removing containers, networks, and volumes..."
  docker compose down -v
else
  docker compose down
fi

docker compose up --build
