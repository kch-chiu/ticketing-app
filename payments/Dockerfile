FROM node:16.13.0-alpine

ARG NODE_AUTH_TOKEN
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --only=prod
RUN rm -f .npmrc
COPY . .

ENTRYPOINT ["npm", "start"]