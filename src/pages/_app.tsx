import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { type AppType } from "next/app";
import GoogleAnalytics from "~/components/analytics/GoogleAnalytics";
import NextHead from "~/components/shared/NextHead";
import { modals } from "~/components/shared/modals/modalComponents";
import { RoomProvider } from "~/hooks/useRoom";
import useSettings from "~/hooks/useSettings/useSettings";
import { SocketProvider } from "~/hooks/useSocket";
import { UserProvider } from "~/hooks/useUser";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import SEO from "~/config/next-seo.config";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const { primaryColor } = useSettings();

  return (
    <>
      {/* Head */}
      <DefaultSeo {...SEO} />
      {/* Body */}
      <MantineProvider
        theme={{
          colorScheme: "dark",
          colors: {
            brand: [
              "#f0eaff",
              "#d1c1f4",
              "#b199e7",
              "#9171dc",
              "#7248d0",
              "#592fb7",
              "#45248f",
              "#311968",
              "#7248d0",
              "#592fb7",
            ],
          },
          primaryColor,
          fontFamily: "Montserrat, sans-serif",
          breakpoints: {
            xs: "30em",
            sm: "48em",
            md: "64em",
            lg: "74em",
            xl: "90em",
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider modals={modals}>
          <Notifications position="top-center" />

          <SessionProvider session={session}>
            <SocketProvider>
              <RoomProvider>
                <UserProvider>
                  <GoogleAnalytics />

                  <Component {...pageProps} />
                </UserProvider>
              </RoomProvider>
            </SocketProvider>
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
