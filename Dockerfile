FROM node:24-alpine

WORKDIR /app

COPY atreides/package.json ./package.json
COPY atreides/package-lock.json ./package-lock.json
RUN npm ci

COPY atreides/src ./src
COPY atreides/tsconfig.json ./tsconfig.json
COPY atreides/student-journey.json ./student-journey.json

RUN npx tsc

CMD ["node", "dist/src/server.js"]
