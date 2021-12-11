FROM node:16.13.0

ENV CI=true

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci

COPY components /app/components
COPY hooks /app/hooks
COPY pages /app/pages
COPY ssr /app/ssr

CMD ["npm", "start"]