import { AppShell, Burger, Button, Flex, Footer, Header, MediaQuery, Modal, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import PageLayout from "~/components/layout";


const Home: NextPage = () => {
  return <PageLayout />
};

export default Home;
