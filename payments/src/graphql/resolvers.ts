import Stripe from "stripe";
import { stripeWrapper } from "../StripeWrapper";
import { Resolvers, Payment } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";

interface PaymentData {
  payment: Payment;
  addPaymentPayload: {
    payment: [Payment]
  }
  deletePaymentPayload: {
    payment: [Payment]
  }
}

const { 
  STRIPE_PAYMENT_METHOD_TYPE, 
  STRIPE_CURRENCY, 
  STRIPE_MODE, 
  STRIPE_CALLBACK_URL, 
  STRIPE_CALLBACK_URL_SUCESS, 
  STRIPE_CALLBACK_URL_CANCEL 
} = process.env;

const getGraphQLClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;
const getStripeClient = (): Stripe => <Stripe>stripeWrapper.client;

const resolvers: Resolvers = {
  Payment: {
    //@ts-ignore
    order: ({ order }: any) => {
      return { __typename: "Order", orderId: order };
    }
  },
  Mutation: {
    addPayment: async (_: any, { data: inputData }) => {
      // Get an instance of stripe
      const stripeClient = getStripeClient();
      
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

      const { title, price, orderId } = inputData;

      if (!title)
        throw new UserInputError("Title can't be empty");

      if (price <= 0)
        throw new UserInputError("Price must be greater than 0");

      const success_url = `${STRIPE_CALLBACK_URL}/${orderId}/${STRIPE_CALLBACK_URL_SUCESS}`;
      const cancel_url = `${STRIPE_CALLBACK_URL}/${orderId}/${STRIPE_CALLBACK_URL_CANCEL}`;

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: [<Stripe.Checkout.SessionCreateParams.PaymentMethodType>STRIPE_PAYMENT_METHOD_TYPE],
        line_items: [
          {
            price_data: {
              currency: STRIPE_CURRENCY!,
              product_data: {
                name: title
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: <Stripe.Checkout.SessionCreateParams.Mode>STRIPE_MODE,
        success_url,
        cancel_url
      });

      const stripeId = session.id;

      // Create a mutation
      const mutation = gql`
        mutation addPayment($addPaymentInput: [AddPaymentInput!]!) {
          addPaymentPayload: addPayment(input: $addPaymentInput) {
            payment {
              paymentId
              stripeId
              order {
                orderId
              }
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        "addPaymentInput": [
          {
            stripeId,
            "order": {
              orderId
            }
          }
        ]
      };

      // Run mutation
      let data;
      try {
        data = <PaymentData>await graphQLClient.request(mutation, variables);
      } catch (error) {
        throw new UserInputError("Invalid orderId");
      }

      const [ payment ] = data.addPaymentPayload.payment;

      // Update reference for Apollo Federation
      //@ts-ignore
      payment.order = payment.order.orderId;

      return payment;
    },
    deletePayment: async (_: any, { paymentId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

      // Create a mutation.
      const mutation = gql`
        mutation deletePayment($deletePaymentFilter: PaymentFilter!) {
          deletePaymentPayload: deletePayment(filter: $deletePaymentFilter) {
            payment {
              paymentId
              stripeId
              order {
                orderId
              }
            }
          }
        }
      `;

      // Define variables for mutation
      const variables = {
        "deletePaymentFilter": {
          paymentId
        }
      };

      // Run mutation
      let data;
      try {
        data = <PaymentData>await graphQLClient.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid paymentId");
      }

      const [ payment ] = data.deletePaymentPayload.payment;

      if (!payment)
        throw new UserInputError("Cannot delete payment since paymentId not found");

      // Update reference for Apollo Federation
      //@ts-ignore
      payment.order = payment.order.orderId;

      return payment;
    }
  },
};

export default resolvers;