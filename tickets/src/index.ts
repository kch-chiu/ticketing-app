import { app } from "./app";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";
import _ from 'lodash';

const start = async () => {
  console.log("Starting.............");

  if (_.isEmpty(process.env.GATEWAY_DGRAPH_URL))
    throw new Error("GATEWAY_DGRAPH_URL must be defined");

  try {
    graphQLClientWrapper.connect(<string>process.env.GATEWAY_DGRAPH_URL);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
