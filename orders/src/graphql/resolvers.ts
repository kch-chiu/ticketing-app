import { Resolvers, OrderStatus, Order } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";

interface OrderData {
  order: Order;
  allOrders: [Order];
  addOrderPayload: {
    order: [Order]
  }
  updateOrderPayload: {
    order: [Order]
  }
  deleteOrderPayload: {
    order: [Order]
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
            ticket {
              ticketId
            }
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

      if (!data.order)
        throw new UserInputError("Order cannot be found");

      // Update reference for Apollo Federation
      //@ts-ignore
      data.order.ticket = data.order.ticket.ticketId;

      return data.order;
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
            ticket {
              ticketId
            }
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

      // Update reference for Apollo Federation
      //@ts-ignore
      (data.allOrders).map(order => order.ticket = order.ticket.ticketId);

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
            ticket {
              ticketId
            }
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

      if (!data.order)
        throw new UserInputError("Cannot find order")

      // Update reference for Apollo Federation
      //@ts-ignore
      data.order.ticket = data.order.ticket.ticketId;

      return data.order;
    },
  },
  Mutation: {
    addOrder: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      const { status, ticketId } = inputData;

      if (!Object.values(OrderStatus).includes(status))
        throw new UserInputError("Status is not a valid status");

      // Create a mutation
      const mutation = gql`
        mutation addOrder($addOrderInput: [AddOrderInput!]!) {
          addOrderPayload: addOrder(input: $addOrderInput) {
            order {
              orderId
              status
              ticket {
                ticketId
              }
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        "addOrderInput": [
          {
            status,
            "ticket": {
              ticketId
            }
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

      // Update reference for Apollo Federation
      //@ts-ignore
      data.addOrderPayload.order[0].ticket = data.addOrderPayload.order[0].ticket.ticketId;

      return data.addOrderPayload.order[0];
    },
    updateOrder: async (_: any, { orderId, data: inputData }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      const { status } = inputData;

      if (!Object.values(OrderStatus).includes(status))
        throw new UserInputError("Status is not a valid status");

      // Create a mutation
      const mutation = gql`
        mutation updateOrder($updateOrderInput: UpdateOrderInput!) {
          updateOrderPayload: updateOrder(input: $updateOrderInput) {
            order {
              orderId
              status
              ticket {
                ticketId
              }
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        "updateOrderInput": {
          "filter": {
            orderId
          },
          "set": {
            status
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

      if (!data.updateOrderPayload.order)
        throw new UserInputError("Cannot update order since orderId not found");

      // Update reference for Apollo Federation
      //@ts-ignore
      data.updateOrderPayload.order[0].ticket = data.updateOrderPayload.order[0].ticket.ticketId;

      return data.updateOrderPayload.order[0];
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
              ticket {
                ticketId
              }
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        "deleteOrderFilter": {
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

      if (!data.deleteOrderPayload.order)
        throw new UserInputError("Cannot delete order since orderId not found");

      // Update reference for Apollo Federation
      //@ts-ignore
      data.updateOrderPayload.order[0].ticket = data.updateOrderPayload.order[0].ticket.ticketId;
      
      return data.deleteOrderPayload.order[0];
    },
  },
};

export default resolvers;
