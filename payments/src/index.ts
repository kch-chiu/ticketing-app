import { app } from "./app";
import Stripe from "stripe";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";
import { stripeWrapper } from "./StripeWrapper";
import _ from 'lodash';

const start = async () => {
  console.log("Starting.............");

  const { DGRAPH_GATEWAY_URL, STRIPE_KEY, STRIPE_API_VERSION } = process.env;

  if (_.isEmpty(DGRAPH_GATEWAY_URL))
    throw new Error("GATEWAY_DGRAPH_URL must be defined");

  if (_.isEmpty(STRIPE_KEY))
    throw new Error("STRIPE_KEY must be defined");

  try {
    graphQLClientWrapper.connect(DGRAPH_GATEWAY_URL!);
    console.log("Connected to Dgraph");
    stripeWrapper.connect(STRIPE_KEY!, <Stripe.LatestApiVersion>STRIPE_API_VERSION);
    console.log("Connected to stripe");
  } catch (err) {
    console.error(err);
  }

  app.listen(4003, () => {
    console.log("Listening on port 4003!!!!!!");
  });
};

start();
