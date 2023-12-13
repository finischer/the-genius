import { Avatar, Flex, Text } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import React from "react";
import { formatTimestamp } from "~/utils/dates";
import type { IUserDetailsModalProps } from "./userDetailsModal.types";

const UserDetailsModal: React.FC<ContextModalProps<IUserDetailsModalProps>> = ({ innerProps, ...props }) => {
  const { user } = innerProps;

  return (
    <Flex
      direction="column"
      gap="md"
    >
      <Avatar
        size={48}
        src={user.image}
        radius={26}
      />
      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Email verifiziert: {user.emailVerified ? "Ja" : "Nein"}</Text>
      <Text>Rolle: {user.role}</Text>
      <Text>Zuletzt geändert am: {formatTimestamp(user.updatedAt.toString())}</Text>
    </Flex>
  );
};

export default UserDetailsModal;
