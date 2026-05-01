FROM node:24-alpine

WORKDIR /app

COPY enxoval/types/package.json ./enxoval/types/package.json
COPY enxoval/observability/package.json ./enxoval/observability/package.json
COPY enxoval/http/package.json ./enxoval/http/package.json
COPY enxoval/auth/package.json ./enxoval/auth/package.json
COPY enxoval/db/package.json ./enxoval/db/package.json
COPY enxoval/messaging/package.json ./enxoval/messaging/package.json
COPY atreides/package.json ./atreides/package.json

COPY enxoval/types/dist ./enxoval/types/dist
COPY enxoval/observability/dist ./enxoval/observability/dist
COPY enxoval/http/dist ./enxoval/http/dist
COPY enxoval/auth/dist ./enxoval/auth/dist
COPY enxoval/db/dist ./enxoval/db/dist
COPY enxoval/messaging/dist ./enxoval/messaging/dist

RUN printf '{"name":"app","private":true,"workspaces":["enxoval/types","enxoval/observability","enxoval/http","enxoval/auth","enxoval/db","enxoval/messaging","atreides"]}' > package.json
RUN npm install

WORKDIR /app/atreides

COPY atreides/src ./src
COPY atreides/tsconfig.json ./
COPY atreides/student-journey.json ./

RUN /app/node_modules/.bin/tsc

CMD ["node", "dist/src/server.js"]
