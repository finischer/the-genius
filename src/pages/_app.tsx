import { Button, MantineProvider, type MantineThemeColors } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useState } from 'react';
import { RoomProvider } from '~/hooks/useRoom';
import useSettings from '~/hooks/useSettings/useSettings';
import { SocketProvider } from '~/hooks/useSocket';
import { UserProvider } from '~/hooks/useUser';
import "~/styles/globals.css";
import { api } from "~/utils/api";



const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { primaryColor } = useSettings()

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        colors: {
          brand: ['#f0eaff', '#d1c1f4', '#b199e7', '#9171dc', '#7248d0', '#592fb7', '#45248f', '#311968', '#7248d0', '#592fb7'],
        },
        primaryColor,
        fontFamily: 'Montserrat, sans-serif'
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ModalsProvider>
        <Notifications position='top-center' />

        <SessionProvider session={session}>
          <SocketProvider>
            <RoomProvider>
              <UserProvider>
                <Component {...pageProps} />
              </UserProvider>
            </RoomProvider>
          </SocketProvider>
        </SessionProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};


export default api.withTRPC(MyApp);

