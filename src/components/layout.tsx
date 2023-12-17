import {
  AppShell,
  Burger,
  Button,
  Flex,
  Header,
  MediaQuery,
  Modal,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";
import { useUser } from "~/hooks/useUser";
import Footer from "./Footer";
import AuthenticatedLayout from "./auth.layout";
import Navbar from "./navbar";
import Loader from "./shared/Loader";

interface IPageLayout {
  showLoader?: boolean;
  loadingMessage?: string;
  children?: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({ showLoader = false, loadingMessage = "Lädt ...", children }) => {
  const { data: session, status } = useSession();
  const { pageIsLoading } = useLoadingState();
  const theme = useMantineTheme();
  const [isNavbarOpened, setIsNavbarOpened] = useState(false);
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
          styles={{
            main: {
              background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={<Navbar opened={isNavbarOpened} />}
          footer={<Footer />}
          header={
            <Header
              height={{ base: 50, md: 70 }}
              p="md"
            >
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <MediaQuery
                  largerThan="sm"
                  styles={{ display: "none" }}
                >
                  <Burger
                    opened={isNavbarOpened}
                    onClick={() => setIsNavbarOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>

                {session.user.username && <Text>Schön dich zu sehen, {session.user.username}!</Text>}
              </div>
            </Header>
          }
        >
          {showLoader && <Loader message={loadingMessage} />}
          {pageIsLoading && <Loader message="Lädt" />}
          {!showLoader && !pageIsLoading && <Text>{children}</Text>}
        </AppShell>
      </AuthenticatedLayout>
    );
  }

  return <></>;
};

export default PageLayout;
