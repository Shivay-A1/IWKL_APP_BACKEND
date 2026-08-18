FROM node:18-alpine

WORKDIR /app

COPY admin/package*.json ./
RUN npm install

COPY admin/ .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]