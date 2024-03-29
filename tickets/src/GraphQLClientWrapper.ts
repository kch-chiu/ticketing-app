import { GraphQLClient } from "graphql-request";
import _ from 'lodash';

class GraphQLClientWrapper {
  private _client?: GraphQLClient;

  get client() {
    if (_.isEmpty(this._client))
      throw new Error("Cannot access client before connecting.");

    return this._client;
  }

  connect(url: string) {
    this._client = new GraphQLClient(url);

    return this.client;
  }
}

export const graphQLClientWrapper = new GraphQLClientWrapper();
