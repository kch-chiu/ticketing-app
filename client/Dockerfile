FROM node:16.13.0-alpine

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci --production

COPY components hooks pages ssr /app/

CMD ["npm", "start"]