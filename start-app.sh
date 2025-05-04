# File: start-app.sh
# Modified: 4/24/2025
#
# This is the main build script. Run this script from the root project directory to start the application
# Now uses docker commands to start the app

docker compose down -v
docker compose up --build