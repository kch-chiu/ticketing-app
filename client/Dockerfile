FROM node:16.13.0-alpine

WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY . .

ENTRYPOINT ["npm", "start"]