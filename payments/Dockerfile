FROM node:16.13.0

ARG NODE_AUTH_TOKEN

WORKDIR /app
COPY package.json package-lock.json .npmrc tsconfig.json /app/

RUN npm ci --production
RUN rm -f .npmrc

COPY src /app/src

CMD ["npm", "start"]