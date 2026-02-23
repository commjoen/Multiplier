# Use Node.js Alpine as base image for small size
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy app files first
COPY . .

# Install http-server globally  
RUN npm install -g http-server

# Expose port
EXPOSE 3000

# Start the server
CMD ["http-server", "-p", "3000", "-c-1"]