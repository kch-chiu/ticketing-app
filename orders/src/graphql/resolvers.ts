import { Resolvers, OrderStatus, Order } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";
import _ from 'lodash';

interface OrderData {
  getOrder: Order;
  allOrders: [Order];
  addOrder: {
    order: Order
  }
  updateOrder: {
    order: Order
  }
  deleteOrder: {
    order: Order
  }
}

const getClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query {
          getOrder(orderId: ${orderId}) {
            orderId
            status
            ticket
          }
        }
      `;

      // Run query and get order.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Invalid orderId");
      }

      if (_.isEmpty(data.getOrder))
        throw new UserInputError("Order cannot be found");

      return data.getOrder;
    },
    //@ts-ignore
    ticket: ({ ticket }: any) => {
      return { __typename: "Ticket", ticketId: ticket };
    },
  },
  Query: {
    allOrders: async () => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query {
          allOrders: queryOrder {
            orderId
            status
            ticket
          }
        }
      `;

      // Run query and get all orders.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch orders");
      }

      return data.allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query {
          getOrder(orderId: ${orderId}) {
            orderId
            status
            ticket
          }
        }
      `;

      // Run query and get order.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Invalid orderId");
      }

      if (_.isEmpty(data.getOrder))
        throw new UserInputError("Cannot find order")

      return data.getOrder;
    },
  },
  Mutation: {
    addOrder: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      const { status } = inputData;

      if (_.includes(OrderStatus, status) === false)
        throw new UserInputError("Status is not a valid status");

      // Create a mutation.
      const mutation = gql`
        mutation {
          addOrder(input: ${inputData}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <OrderData>await client.request(mutation);
      } catch (error) {
        throw new UserInputError("Invalid tickedId");
      }

      if (_.isEmpty(data.addOrder.order.ticket))
        throw new UserInputError("Cannot create order since ticketId not found");

      return data.addOrder.order;
    },
    updateOrder: async (_: any, { orderId, data: inputData }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      const { status } = inputData;

      if (_.includes(OrderStatus, status) === false)
        throw new UserInputError("Status is not a valid status");

      const patch = {
        filter: {
          orderId,
        },
        set: {
          ...inputData,
        },
      };

      // Create a mutation.
      const mutation = gql`
        mutation {
          updateOrder(input: ${patch}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <OrderData>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      if (_.isEmpty(data.updateOrder.order))
        throw new UserInputError("Cannot update order since orderId not found");

      return data.updateOrder.order;
    },
    deleteOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a mutation.
      const mutation = gql`
        mutation {
          updateOrder(orderId: ${orderId}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <OrderData>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      if (_.isEmpty(data.deleteOrder.order))
        throw new UserInputError("Cannot delete order since orderId not found");

      return data.deleteOrder.order;
    },
  },
};

export default resolvers;
