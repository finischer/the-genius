import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { type AppType } from "next/app";
import { modals } from "~/components/shared/modals/modalComponents";
import SEO from "~/config/next-seo.config";
import { RoomProvider } from "~/hooks/useRoom";
import { UserProvider } from "~/hooks/useUser";
import { THEME, cssResolver } from "~/styles/constants";

import "~/styles/globals.css";
import { api } from "~/utils/api";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { env } from "~/env.mjs";
import { isDevelopmentClient } from "~/utils/environment";

if (typeof window !== "undefined" && !isDevelopmentClient) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    person_profiles: "identified_only",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (isDevelopmentClient) posthog.debug();
    }
  });
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
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
            <RoomProvider>
              <UserProvider>
                <Component {...pageProps} />
              </UserProvider>
            </RoomProvider>
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </PostHogProvider>
  );
};

export default api.withTRPC(MyApp);
