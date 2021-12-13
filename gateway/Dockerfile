FROM node:16.13.0-alpine AS base
WORKDIR /usr/src/gateway
COPY package.json package-lock.json ./

FROM base AS builder
ARG NODE_AUTH_TOKEN
COPY .npmrc .
RUN npm install --production
RUN rm -f .npmrc

FROM base AS runner
COPY --from=builder /usr/src/gateway/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]