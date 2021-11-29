FROM okteto/node:16.13.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["npm", "start"]