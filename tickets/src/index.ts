import { app } from "./app";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";
import _ from 'lodash';

const start = async () => {
  console.log("Starting.............");

  const { GATEWAY_API_URL } = process.env;

  if (_.isEmpty(GATEWAY_API_URL))
    throw new Error("GATEWAY_API_URL must be defined");

  try {
    graphQLClientWrapper.connect(GATEWAY_API_URL!);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
