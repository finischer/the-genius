import { MantineProvider } from '@mantine/core';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/globals.css";

import { api } from "~/utils/api";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark"
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>

  );
};

export default api.withTRPC(MyApp);
