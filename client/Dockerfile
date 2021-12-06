FROM node:16.13.0-alpine

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm install --production

COPY . /app

ENTRYPOINT ["npm", "start"]