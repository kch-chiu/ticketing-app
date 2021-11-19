import { app } from "./app";
import Stripe from "stripe";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";
import { stripeWrapper } from "./StripeWrapper";
import _ from 'lodash';

const start = async () => {
  console.log("Starting.............");

  if (_.isEmpty(process.env.GATEWAY_DGRAPH_URL))
    throw new Error("GATEWAY_DGRAPH_URL must be defined");

  if (_.isEmpty(process.env.STRIPE_KEY))
    throw new Error("STRIPE_KEY must be defined");

  try {
    graphQLClientWrapper.connect(<string>process.env.GATEWAY_DGRAPH_URL);
    console.log("Connected to Dgraph");
    stripeWrapper.connect(<string>process.env.STRIPE_KEY, <Stripe.LatestApiVersion>process.env.STRIPE_API_VERSION);
    console.log("Connected to stripe");
  } catch (err) {
    console.error(err);
  }

  app.listen(4003, () => {
    console.log("Listening on port 4003!!!!!!");
  });
};

start();
