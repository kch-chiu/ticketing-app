FROM okteto/node:14

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
RUN rm -f .npmrc
COPY . .

ENTRYPOINT [ "npm", "start" ]