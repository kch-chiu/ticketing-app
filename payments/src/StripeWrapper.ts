import Stripe from "stripe";
import _ from 'lodash';

class StripeWrapper {
  private _client?: Stripe;

  get client() {
    if (_.isEmpty(this._client))
      throw new Error("Cannot access client before connecting.");

    return this._client;
  }

  connect(url: string, apiVersion: Stripe.LatestApiVersion ) {
    this._client = new Stripe(url, { apiVersion });

    return this._client;
  }
}

export const stripeWrapper = new StripeWrapper();
