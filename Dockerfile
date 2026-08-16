FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/server.ts ./server.ts
COPY tsconfig.json ./
RUN npx tsc

EXPOSE 3000

CMD ["node", dist/server.js"]
