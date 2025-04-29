# Step 1: Build React app
FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:alpine

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build folder to nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]