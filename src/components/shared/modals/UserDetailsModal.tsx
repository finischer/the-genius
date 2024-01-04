import { Avatar, Flex, Text } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import type { User } from "@prisma/client";
import React from "react";
import { formatTimestamp } from "~/utils/dates";

interface IUserDetailsModalProps {
  user: User;
}

const UserDetailsModal: React.FC<ContextModalProps<IUserDetailsModalProps>> = ({ innerProps }) => {
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
      <Text>Email verifiziert: {user.isEmailVerified ? "Ja" : "Nein"}</Text>
      <Text>Rolle: {user.role}</Text>
      <Text>Zuletzt geändert am: {formatTimestamp(user.updatedAt)}</Text>
    </Flex>
  );
};

export default UserDetailsModal;
