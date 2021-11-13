FROM node:16.13.0-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=prod
COPY . .

ENTRYPOINT [ "npm", "start" ]