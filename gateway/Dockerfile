FROM node:16.13.0-alpine

ARG NODE_AUTH_TOKEN
WORKDIR /app
COPY package.json package-lock.json .npmrc /app/

RUN npm install --production
RUN rm -f .npmrc

COPY . /app

ENTRYPOINT ["npm", "start"]