FROM node:latest

# Set the working directory
WORKDIR /Users/jayesh/Documents/Metadome/redis_app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port
EXPOSE 6000

# Start the application
CMD ["node", "redis.js"]
