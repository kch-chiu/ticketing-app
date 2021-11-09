import { Resolvers, Ticket } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";
import _ from 'lodash';

interface TicketData {
  getTicket: Ticket;
  allTickets: [Ticket];
  addTicket: {
    ticket: Ticket
  }
  updateTicket: {
    ticket: Ticket
  }
  deleteTicket: {
    ticket: Ticket
  }
}

const getClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query getTicket {
          ticket: getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.getTicket))
        throw new UserInputError("Ticket cannot be found");

      return data.getTicket;
    },
  },
  Query: {
    getAllTickets: async () => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query getAllTickets {
          allTickets: queryTicket {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get all tickets.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch tickets");
      }

      return data.allTickets;
    },
    getTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query getTicket {
          ticket: getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.getTicket))
        throw new UserInputError("Cannot find ticket");

      return data.getTicket;
    },
  },
  Mutation: {
    addTicket: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQL Client.
      const client = getClient();

      const { title, price } = inputData;

      if (_.isEmpty(title))
        throw new UserInputError("Title can't be empty");
        
      if (price <= 0)
        throw new UserInputError("Price must be greater than 0");

      // Create a mutation.
      const mutation = gql`
        mutation addTicket {
          addTicketPayload: addTicket(input: ${inputData}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <TicketData>await client.request(mutation);
      } catch (error) {
        throw new UserInputError("Cannot create ticket");
      }

      return data.addTicket.ticket;
    },
    updateTicket: async (_: any, { ticketId, data: inputData }) => {
      // Get an instance of GrahpQL Client.
      const client = getClient();

      const { price } = inputData;

      if (price <= 0)
        throw new UserInputError("Price must be greater than zero");

      const patch = {
        filter: {
          ticketId,
        },
        set: {
          ...inputData,
        },
      };

      // Create a mutation.
      const mutation = gql`
        mutation updateTicket{
          updateTicketPayload: updateTicket(input: ${patch}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <TicketData>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.updateTicket.ticket))
        throw new UserInputError("Cannot update ticket since ticketId not found");

      return data.updateTicket.ticket;
    },
    deleteTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a mutation.
      const mutation = gql`
        mutation deleteTicket {
          deleteTicketPayload: deleteTicket(ticketId: ${ticketId}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <TicketData>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.deleteTicket.ticket))
        throw new UserInputError("Cannot delete ticket since ticketId not found");

      return data.deleteTicket.ticket;
    }
  },
};

export default resolvers;
