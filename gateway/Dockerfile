FROM node:16.13.0-alpine

ARG NODE_AUTH_TOKEN
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci --production
RUN rm -f .npmrc

COPY . /app

ENTRYPOINT ["npm", "start"]