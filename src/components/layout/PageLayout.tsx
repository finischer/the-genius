import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  Skeleton,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import { useUser } from "~/hooks/useUser";
import AuthenticatedLayout from "../auth.layout";
import Loader from "../shared/Loader";
import Navbar from "../Navbar";
import { useDisclosure } from "@mantine/hooks";

interface IPageLayout {
  showLoader?: boolean;
  loadingMessage?: string;
  children?: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({ showLoader = false, loadingMessage = "Lädt ...", children }) => {
  const { data: session, status } = useSession();
  const { pageIsLoading } = useLoadingState();
  const [opened, { toggle }] = useDisclosure();
  const [usernameInput, setUsernameInput] = useState("");
  const { updateUsername, isLoading } = useUser();
  const router = useRouter();

  const handleSaveUsername = async () => {
    await updateUsername(usernameInput);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/auth/signin");
    }
  }, [status]);

  if (status === "authenticated") {
    return (
      <AuthenticatedLayout>
        <Modal
          opened={!session.user.username}
          title="Zeig den Leuten, wer du bist"
          onClose={() => null}
          withCloseButton={false}
          centered
          size="sm"
          transitionProps={{ transition: "fade", duration: 200 }}
        >
          <Flex
            gap="md"
            direction="column"
          >
            <TextInput
              placeholder=""
              label="Dein Username"
              withAsterisk
              maxLength={30}
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            <Button
              variant="filled"
              onClick={handleSaveUsername}
              loading={isLoading}
            >
              Namen speichern
            </Button>
          </Flex>
        </Modal>

        <AppShell
          header={{ height: { base: 60, md: 70, lg: 80 } }}
          navbar={{
            width: { base: 200, md: 300, lg: 400 },
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group
              h="100%"
              px="md"
            >
              <Burger
                color="gray.4"
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              {session.user.username && <Text>Schön dich zu sehen, {session.user.username}!</Text>}
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <Navbar />
          </AppShell.Navbar>
          <AppShell.Main h="1rem">
            {showLoader && <Loader message={loadingMessage} />}
            {pageIsLoading && <Loader message="Lädt" />}
            {!showLoader && !pageIsLoading && <Box h="100%">{children}</Box>}
          </AppShell.Main>
        </AppShell>
      </AuthenticatedLayout>
    );
  }

  return <></>;
};

export default PageLayout;
