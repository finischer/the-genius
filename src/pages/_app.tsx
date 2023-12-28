import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { type AppType } from "next/app";
import GoogleAnalytics from "~/components/analytics/GoogleAnalytics";
import { modals } from "~/components/shared/modals/modalComponents";
import SEO from "~/config/next-seo.config";
import { RoomProvider } from "~/hooks/useRoom";
import { SocketProvider } from "~/hooks/useSocket";
import { UserProvider } from "~/hooks/useUser";
import { THEME, cssResolver } from "~/styles/constants";
import "@mantine/core/styles.css";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      {/* Head */}
      <DefaultSeo {...SEO} />
      {/* Body */}
      <MantineProvider
        theme={THEME}
        defaultColorScheme="dark"
        cssVariablesResolver={cssResolver}
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
