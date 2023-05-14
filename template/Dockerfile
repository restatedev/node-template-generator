FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install
RUN npm run proto
RUN npm run build
RUN npm prune --production --omit=dev

EXPOSE 8080
ENTRYPOINT ["node", "./dist/app.js"]
