import "bootstrap/dist/css/bootstrap.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

const AppComponent = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default AppComponent;
