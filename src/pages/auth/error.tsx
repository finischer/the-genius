import { Button, Flex } from "@mantine/core";
import { useRouter } from "next/router";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";

const AuthErrorPage = () => {
  const router = useRouter();
  const { pageIsLoading } = useLoadingState();
  const errorMessage = router.query.error ?? "Anmeldung fehlgeschlagen";

  return (
    <Flex
      h="100vh"
      justify="center"
      align="center"
    >
      <Flex
        direction="column"
        gap="md"
        align="center"
      >
        <div>Fehler: {errorMessage}</div>
        <Button.Group>
          <Button
            onClick={() => void router.push("/")}
            loading={pageIsLoading}
          >
            Zum Login zurück
          </Button>
        </Button.Group>
      </Flex>
    </Flex>
  );
};

export default AuthErrorPage;
