FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads and logs directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
