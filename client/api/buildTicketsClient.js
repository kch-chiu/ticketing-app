import axios from "axios";

export default ({ req }) => {
  const ticketsURL = process.env.NEXT_PUBLIC_TICKETS_URL;
  console.log(`client-tickets-url is: ${ticketsURL}`);
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      // Remote Cluster
      baseURL: ticketsURL,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
