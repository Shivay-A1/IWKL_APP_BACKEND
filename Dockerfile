FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/server.ts ./
RUN npx tsc server.ts --outDir dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
