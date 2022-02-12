import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import buildApiClient from "../ssr/buildApiClient";
import Header from "../components/header";

const LandingPage = ({ tickets }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (typeof window !== "undefined" && loading) return null;

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Header session={session} />
      <div className="container">
        <h2>Tickets</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);

  const apiClient = buildApiClient(context);

  const ticketsRelativeURL = process.env.NEXT_PUBLIC_TICKETS_RELATIVEURL;

  const { data: tickets } = await apiClient.get(`${ticketsRelativeURL}`);

  return { props: { session, tickets } };
};

export default LandingPage;
