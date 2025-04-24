# Use an official Node.js LTS image
FROM node:18

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Make sure the wait-for-db script is executable
RUN chmod +x ./wait-for-db.sh

# Expose the port used by the app
EXPOSE 5000

# Start the app using wait-for-db
CMD ["./wait-for-db.sh", "db", "node", "server.js"]