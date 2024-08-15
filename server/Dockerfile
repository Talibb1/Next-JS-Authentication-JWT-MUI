# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /index.js

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the app
CMD ["npm","run", "dev"]

