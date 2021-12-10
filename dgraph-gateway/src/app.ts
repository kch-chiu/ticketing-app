import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

import { errorHandler, NotFoundError } from "@kch-chiu/common";

const app = express();

const startApolloServer = async (app: Express) => {
  const gateway = new ApolloGateway();

  const server = new ApolloServer({ gateway });

  await server.start();

  app.use(cors());

  server.applyMiddleware({ app });

  app.all("*", (_: any, __: any) => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
}

startApolloServer(app);

export { app };
