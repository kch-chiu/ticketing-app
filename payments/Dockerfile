FROM node:16.13.0-alpine as builder
ARG NODE_AUTH_TOKEN
WORKDIR /usr/src/app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --production
RUN rm -f .npmrc

FROM node:16.13.0-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
CMD ["npm", "start"]