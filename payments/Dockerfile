FROM node:16.13.0-alpine

ARG NODE_AUTH_TOKEN
WORKDIR /app
COPY package.json package.json
COPY .npmrc .npmrc
RUN npm install --production
RUN rm -f .npmrc
COPY . .

ENTRYPOINT ["npm", "start"]