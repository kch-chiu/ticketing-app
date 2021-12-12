FROM node:16.13.0-alpine AS base
ARG NODE_AUTH_TOKEN
WORKDIR /usr/src/gateway
COPY package.json package-lock.json .npmrc ./

FROM base AS builder
RUN npm ci --production
RUN rm -f .npmrc

FROM base AS runner
COPY --from=builder /usr/src/gateway/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]