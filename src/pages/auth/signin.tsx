import { Flex } from "@mantine/core";
import AuthenticationModal from "~/compositions/modals/AuthenticationModal";

const SignInPage = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      h="100vh"
      pos="relative"
    >
      <AuthenticationModal />
    </Flex>
  );
};

export default SignInPage;
