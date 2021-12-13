FROM node:16.13.0-alpine AS base
WORKDIR /usr/src/client
COPY package.json package-lock.json ./

FROM base AS builder
RUN npm install --production

FROM base AS runner
COPY --from=builder /usr/src/client/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]