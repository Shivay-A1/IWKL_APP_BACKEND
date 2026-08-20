FROM node:18-alpine

WORKDIR /app

# Install OpenSSL dependencies for Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
COPY database_setup.sql ./

# Build without Prisma generation
RUN npm run build

# Expose the port Railway expects
EXPOSE 3000

# Set environment variable for Railway
ENV PORT=3000
ENV NODE_ENV=production

# Create a simple startup script to ensure server starts
RUN echo '#!/bin/sh\n\
echo "Starting IWKL Backend..."\n\
echo "PORT: $PORT"\n\
echo "NODE_ENV: $NODE_ENV"\n\
exec node dist/server.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start the server using the startup script
CMD ["/app/start.sh"]
