import { Flex } from "@mantine/core";
import React from "react";
import Footer from "~/components/Footer";
import GoogleAnalytics from "~/components/analytics/GoogleAnalytics";
import AuthenticationModal from "~/components/shared/modals/AuthenticationModal";

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
      <Flex
        pos="absolute"
        bottom={0}
      >
        <Footer />
      </Flex>
    </Flex>
  );
};

export default SignInPage;
