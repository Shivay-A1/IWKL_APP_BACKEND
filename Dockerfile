FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
COPY database_setup.sql ./

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
