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

# Simple start with explicit binding
CMD ["sh", "-c", "node dist/server.js"]
