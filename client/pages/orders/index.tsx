import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { useSession, getSession } from "next-auth/react";
import buildApiClient from "../../ssr/buildApiClient";
import Header from "../../components/header";

const OrderIndex = ({ orders }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (typeof window !== "undefined" && loading) return null;

  return session ? (
    <div>
      <Header session={session} />
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <div>Access Denied</div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);
  const apiClient = buildApiClient(context);

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;

  const { data: orders } = await apiClient.get(`${ordersRelativeURL}`);

  return { props: { session, orders } };
};

export default OrderIndex;
