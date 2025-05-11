#!/bin/bash

# File: manage-users.sh
# Modified: 5/7/2025
#
# Provides a way for administrators to update admin credentials from the command line
# Bulk of the code executed in manageUser.js, this is just a wrapper for that functionality
# Docker must be actively running for this script to work
#
# Usage:
#   manage-users.sh add --username USER --password PASS [--email EMAIL] [--admin]
#   manage-users.sh delete --username USER
#   manage-users.sh list

# Validate at least one command (e.g., 'add' or 'delete') is present
if [[ $# -lt 1 ]]; then
  # Let the JS script handle usage output
  docker compose exec backend node manageUsers.js
  exit 1
fi

# Build command by forwarding all arguments as-is
CMD="node manageUsers.js $*"

# Run in Docker
docker compose exec backend sh -c "$CMD"