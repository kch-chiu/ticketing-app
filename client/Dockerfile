FROM node:16.13.0-alpine

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci --production

COPY . /app

ENTRYPOINT ["npm", "start"]