import { Resolvers, Ticket } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";
import _ from 'lodash';

interface TicketData {
  ticket: Ticket;
  allTickets: [Ticket];
  addTicketPayload: {
    ticket: Ticket
  }
  updateTicketPayload: {
    ticket: Ticket
  }
  deleteTicketPayload: {
    ticket: Ticket
  }
}

const getClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query
      const query = gql`
        query getTicket($ticketId: ID!) {
          ticket: getTicket(ticketId: $ticketId) {
            ticketId
            title
            price
          }
        }
      `;

      // Create variables for query
      const variables = {
        ticketId
      };

      // Run query and get ticket
      let data;
      try {
        data = <TicketData>await client.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.ticket))
        throw new UserInputError("Ticket cannot be found");

      return data.ticket;
    },
  },
  Query: {
    getAllTickets: async () => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query
      const query = gql`
        query getAllTickets {
          allTickets: queryTicket {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get all tickets
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch tickets");
      }

      return data.allTickets;
    },
    getTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a query.
      const query = gql`
        query getTicket($ticketId: ID!) {
          ticket: getTicket(ticketId: $ticketId) {
            ticketId
            title
            price
          }
        }
      `;

      // Create variables for query
      const variables = {
        ticketId
      };

      // Run query and get ticket
      let data;
      try {
        data = <TicketData>await client.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.ticket))
        throw new UserInputError("Cannot find ticket");

      return data.ticket;
    },
  },
  Mutation: {
    addTicket: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      const { title, price } = inputData;

      if (_.isEmpty(title))
        throw new UserInputError("Title can't be empty");
        
      if (price <= 0)
        throw new UserInputError("Price must be greater than 0");

      // Create a mutation
      const mutation = gql`
        mutation addTicket($addTicketInput: [AddTicketInput!]!) {
          addTicketPayload: addTicket(input: $addTicketInput) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Create variables for mutation
      const variables = {
        addTicketInput: [
          {
            ...inputData
          }
        ]
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await client.request(mutation, variables);
      } catch (error) {
        throw new UserInputError("Cannot create ticket");
      }

      return data.addTicketPayload.ticket;
    },
    updateTicket: async (_: any, { ticketId, data: inputData }) => {
      // Get an instance of GrahpQL Client.
      const client = getClient();

      const { price } = inputData;

      if (price <= 0)
        throw new UserInputError("Price must be greater than zero");

      // Create a mutation
      const mutation = gql`
        mutation updateTicket($updateTicketInput: UpdateTicketInput!) {
          updateTicketPayload: updateTicket(input: $updateTicketInput) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Define variables for mutation
      const variables = {
        updateTicketInput: {
          filter: {
            ticketId
          },
          set: {
            ...inputData
          }
        }
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await client.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.updateTicketPayload.ticket))
        throw new UserInputError("Cannot update ticket since ticketId not found");

      return data.updateTicketPayload.ticket;
    },
    deleteTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQL Client
      const client = getClient();

      // Create a mutation
      const mutation = gql`
        mutation deleteTicket($deleteTicketFilter: TicketFilter!) {
          deleteTicketPayload: deleteTicket(filter: $deleteTicketFilter) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Define variables for mutation
      const variables = {
        deleteTicketFilter: {
          ticketId
        }
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await client.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      if (_.isEmpty(data.deleteTicketPayload.ticket))
        throw new UserInputError("Cannot delete ticket since ticketId not found");

      return data.deleteTicketPayload.ticket;
    }
  },
};

export default resolvers;
