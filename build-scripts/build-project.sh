# File: build-project.sh
# Modified: 4/1/2025
#
# Removes all node_modules files and rebuilds the project files from scratch

# Need to run npm install in frontend and backend directories before
#  project will be able to run
cd backend
rm -rf node_modules && npm install

cd ../frontend
rm -rf node_modules && npm install

cd ../ # return to the root directory