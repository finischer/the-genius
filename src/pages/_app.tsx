import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
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
        colorScheme: "dark",
        colors: {
          brand: ['#f0eaff', '#d1c1f4', '#b199e7', '#9171dc', '#7248d0', '#592fb7', '#45248f', '#311968', '#7248d0', '#0c031b'],
        },
        primaryColor: "brand"
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position='top-center' />

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>

  );
};

export default api.withTRPC(MyApp);

