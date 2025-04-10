# File: start-app.sh
# Modified: 4/1/2025
#
# This is the main build script. Run this script from the root project directory to start the application
#
# First performs a check that the project files have already been set up. If not, it will
#  install the necessary packages and then continue with the application startup.
# Once all necessary packages have been installed, it runs child scripts in build-scripts
#  directory to start up the frontend and backend components.

# Check if node_modules exists in both frontend and backend folders
# If not, we need to rebuild the project
if test -d "./backend/node_modules" && test -d "./frontend/node_modules"; then
    echo "Project files already configured. Continuing setup..."
else
    echo "Project files not ready, must rebuild..."
    ./build-scripts/build-project.sh
fi

# Starts both frontend and backend services
# Discard stdout and send stderr output to log file in build-scripts directory
echo ""
echo "Starting app..."
nohup ./build-scripts/start-backend.sh > /dev/null 2> ./build-scripts/script-err.log &
nohup ./build-scripts/start-frontend.sh > /dev/null 2> ./build-scripts/script-err.log &
