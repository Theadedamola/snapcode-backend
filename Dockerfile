FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]