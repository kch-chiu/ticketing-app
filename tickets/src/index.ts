import { app } from "./app";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";
import _ from 'lodash';

const start = async () => {
  console.log("Starting.............");

  const { DGRAPH_API_URL } = process.env;

  if (_.isEmpty(DGRAPH_API_URL))
    throw new Error("DGRAPH_API_URL must be defined");

  try {
    graphQLClientWrapper.connect(DGRAPH_API_URL!);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
