import { Button, Container, Flex, Text, Title } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const ErrorPage404 = () => {
  const router = useRouter();

  return (
    <Flex
      h="100vh"
      justify="center"
      align="center"
    >
      <Flex
        gap="xl"
        align="center"
      >
        <Image
          src="/images/error_404.svg"
          height={450}
          width={450}
          alt="error-404"
        />

        <Flex
          direction="column"
          align="flex-start"
          justify="space-between"
          gap="xl"
        >
          <div>
            <Title>{"Ups!".toUpperCase()}</Title>
            <Title>{"Die Seite scheint nicht zu existieren".toUpperCase()}</Title>
          </div>
          <Button
            tt="uppercase"
            onClick={() => void router.push("/")}
          >
            Zurück zur Startseite
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ErrorPage404;
