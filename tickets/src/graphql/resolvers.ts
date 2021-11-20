import { Resolvers, Ticket } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";

interface TicketData {
  ticket: Ticket;
  allTickets: [Ticket];
  addTicketPayload: {
    ticket: [Ticket]
  }
  updateTicketPayload: {
    ticket: [Ticket]
  }
  deleteTicketPayload: {
    ticket: [Ticket]
  }
}

const getGraphQLClient = (): GraphQLClient => <GraphQLClient>graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <TicketData>await graphQLClient.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      const { ticket } = data;

      if (!ticket)
        throw new UserInputError("Ticket cannot be found");

      return ticket;
    },
  },
  Query: {
    getAllTickets: async () => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <TicketData>await graphQLClient.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch tickets");
      }

      const { allTickets } = data;

      return allTickets;
    },
    getTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        data = <TicketData>await graphQLClient.request(query, variables);
      } catch (error) {
        throw new UserInputError("Invalid ticketId");
      }

      const { ticket } = data;

      if (!ticket)
        throw new UserInputError("Cannot find ticket");

      return ticket;
    },
  },
  Mutation: {
    addTicket: async (_: any, { data: inputData }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

      const { title, price } = inputData;

      if (!title)
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
        "addTicketInput": [
          {
            title,
            price
          }
        ]
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await graphQLClient.request(mutation, variables);
      } catch (error) {
        throw new UserInputError("Cannot create ticket");
      }

      const [ ticket ] = data.addTicketPayload.ticket;

      return ticket;
    },
    updateTicket: async (_: any, { ticketId, data: inputData }) => {
      // Get an instance of GrahpQLClient.
      const graphQLClient = getGraphQLClient();

      const { title, price } = inputData;

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
        "updateTicketInput": {
          "filter": {
            ticketId
          },
          "set": {
            title,
            price
          }
        }
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await graphQLClient.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      const [ ticket ] = data.updateTicketPayload.ticket;

      if (!ticket)
        throw new UserInputError("Cannot update ticket since ticketId not found");

      return ticket;
    },
    deleteTicket: async (_: any, { ticketId }) => {
      // Get an instance of GraphQLClient
      const graphQLClient = getGraphQLClient();

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
        "deleteTicketFilter": {
          ticketId
        }
      };

      // Run mutation
      let data;
      try {
        data = <TicketData>await graphQLClient.request(mutation, variables);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      const [ ticket ] = data.deleteTicketPayload.ticket;

      if (!ticket)
        throw new UserInputError("Cannot delete ticket since ticketId not found");

      return ticket;
    }
  },
};

export default resolvers;
