# Use official Node.js runtime as base image
FROM node:18-slim

# Set working directory in container
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY src/ ./src/

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
