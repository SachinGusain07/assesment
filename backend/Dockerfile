FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose app port (change if different)
EXPOSE 5000

# Start application
CMD ["node", "server.js"]