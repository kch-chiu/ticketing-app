import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSubgraphSchema } from "@apollo/federation";
import "graphql-import-node";
import * as typeDefs from "../src/graphql/schema.graphql";
import resolvers from "../src/graphql/resolvers";
import { Resolvers } from '../src/graphql/types';
import { DocumentNode } from 'graphql';

const app = express();

const startApolloServer = async (app: Express, typeDefs: DocumentNode, resolvers: Resolvers) => {
  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({ schema });

  await server.start();

  server.applyMiddleware({ app });
}

startApolloServer(app, typeDefs, resolvers);

export { app };