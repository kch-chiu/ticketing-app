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
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query
      const query = gql`
        query getOrder($orderId: ID!) {
          order: getOrder(orderId: $orderId) {
            orderId
            status
            ticket
          }
        }
      `;

      // Create variables for query
      const variables = {
        orderId
      };

      // Run query and get order
      let data;
      try {
        data = <OrderData>await client.request(query, variables);
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
    getAllOrders: async () => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query
      const query = gql`
        query getAllOrders {
          allOrders: queryOrder {
            orderId
            status
            ticket
          }
        }
      `;

      // Run query and get all orders
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch orders");
      }

      return data.allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query
      const query = gql`
        query getOrder($orderId: ID!) {
          order: getOrder(orderId: $orderId) {
            orderId
            status
            ticket
          }
        }
      `;

      // Create variables for query
      const variables = {
        orderId
      };

      // Run query and get order
      let data;
      try {
        data = <OrderData>await client.request(query, variables);
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

      // Create a mutation
      const mutation = gql`
        mutation addOrder($addOrderInput: [AddOrderInput!]!) {
          addOrderPayload: addOrder(input: $addOrderInput) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        addOrderInput: [
          {
            ...inputData
          }
        ]
      };

      // Run mutation
      let data;
      try {
        data = <OrderData>await client.request(mutation, variables);
      } catch (error) {
        throw new UserInputError("Invalid tickedId");
      }

      if (_.isEmpty(data.addOrder.order.ticket))
        throw new UserInputError("Cannot create order since ticketId not found");

      return data.addOrder.order;
    },
    updateOrder: async (_: any, { orderId, data: inputData }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      const { status } = inputData;

      if (_.includes(OrderStatus, status) === false)
        throw new UserInputError("Status is not a valid status");

      // Create a mutation
      const mutation = gql`
        mutation updateOrder($updateOrderInput: UpdateOrderInput!) {
          updateOrderPayload: updateOrder(input: $updateOrderInput) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        updateOrderInput: {
          filter: {
            orderId
          },
          set: {
            ...inputData
          }
        }
      }

      // Run mutation
      let data;
      try {
        data = <OrderData>await client.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      if (_.isEmpty(data.updateOrder.order))
        throw new UserInputError("Cannot update order since orderId not found");

      return data.updateOrder.order;
    },
    deleteOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a mutation
      const mutation = gql`
        mutation deleteOrder($deleteOrderFilter: OrderFilter!) {
          deleteOrderPayload: deleteOrder(filter: $deleteOrderFilter) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        deleteOrderFilter: {
          orderId
        }
      }

      // Run mutation
      let data;
      try {
        data = <OrderData>await client.request(mutation, variables);
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
