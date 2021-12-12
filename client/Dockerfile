FROM node:16.13.0-alpine as builder
ARG NODE_AUTH_TOKEN
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:16.13.0-alpine as runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
CMD ["npm", "start"]