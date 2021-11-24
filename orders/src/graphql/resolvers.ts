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

const getGraphQLClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <OrderData>await graphQLClient.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid orderId");
      }

      const { order } = data;

      if (!order)
        throw new UserInputError("Order cannot be found");

      // Update reference for Apollo Federation
      //@ts-ignore
      order.ticket = order.ticket.ticketId;

      return order;
    },
    //@ts-ignore
    ticket: ({ ticket }: any) => {
      return { __typename: "Ticket", ticketId: ticket };
    },
  },
  Query: {
    getAllOrders: async () => {
      // Get an instance of GraphQL Client
      const graphQLClient = getGraphQLClient();

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
        data = <OrderData>await graphQLClient.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch orders");
      }

      const { allOrders } = data;

      // Update reference for Apollo Federation
      //@ts-ignore
      allOrders.map(order => order.ticket = order.ticket.ticketId);

      return allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <OrderData>await graphQLClient.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid orderId");
      }

      const { order } = data;

      if (!order)
        throw new UserInputError("Cannot find order")

      // Update reference for Apollo Federation
      //@ts-ignore
      order.ticket = order.ticket.ticketId;

      return order;
    },
  },
  Mutation: {
    addOrder: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQLClient.
      const graphQLClient = getGraphQLClient();

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
        data = <OrderData>await graphQLClient.request(mutation, variables);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      const [ order ] = data.addOrderPayload.order;

      // Update reference for Apollo Federation
      //@ts-ignore
      order.ticket = order.ticket.ticketId;

      return order;
    },
    updateOrder: async (_: any, { orderId, data: inputData }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

      const { status, ticketId } = inputData;

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
        data = <OrderData>await graphQLClient.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      const [ order ] = data.updateOrderPayload.order;

      if (!order)
        throw new UserInputError("Cannot update order since orderId was not found");

      if (order.ticket.ticketId !== ticketId)
        throw new UserInputError("Cannot update order since ticketId was not found");
        
      // Update reference for Apollo Federation
      //@ts-ignore
      order.ticket = order.ticket.ticketId;

      return order;
    },
    deleteOrder: async (_: any, { orderId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <OrderData>await graphQLClient.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      const [ order ] = data.deleteOrderPayload.order;

      if (!order)
        throw new UserInputError("Cannot delete order since orderId not found");

      // Update reference for Apollo Federation
      //@ts-ignore
      order.ticket = order.ticket.ticketId;
      
      return order;
    },
  },
};

export default resolvers;
