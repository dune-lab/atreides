FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx tsc

CMD ["node", "dist/src/server.js"]
