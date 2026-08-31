FROM node:20-alpine

WORKDIR /app

# Force cache invalidation by adding a build timestamp argument
ARG BUILD_DATE
RUN echo "Build date: $BUILD_DATE"

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["npm", "start"]