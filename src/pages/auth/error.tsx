import { Button, Flex } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { decode, encode } from "querystring";
import useLoadingState from "~/hooks/useLoadingState/useLoadingState";

const AuthErrorPage = () => {
  const { push } = useRouter();
  const { pageIsLoading } = useLoadingState();
  const searchParams = useSearchParams();
  const errorMessage: string = searchParams.get("error") ?? "Anmeldung fehlgeschlagen";

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
            onClick={() => void push("/")}
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
