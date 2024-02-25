import { Button, Flex, Table, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import PageLayout from "~/components/layout/PageLayout";
import ActionIcon from "~/components/shared/ActionIcon";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";
import { formatTimestamp } from "~/utils/dates";

const BetaUsersPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Ungültige Email"),
    },
  });
  const { showSuccessNotification, handleZodError } = useNotification();
  const { data: betaUserList, refetch: refreshBetaUsers, isLoading } = api.betaTesters.getAll.useQuery();
  const { mutate: addBetaUser } = api.betaTesters.create.useMutation({
    onSuccess: () => {
      showSuccessNotification({ message: "Betatester erfolgreich hinzugefügt" });
      void refreshBetaUsers();
      form.reset();
    },
    onError: (error) =>
      handleZodError(error.data?.zodError, error.message ?? "User konnte nicht hinzugefügt werden"),
  });

  const { mutate: deleteBetaUser } = api.betaTesters.deleteById.useMutation({
    onSuccess: () => {
      showSuccessNotification({ message: "Betatester erfolgreich gelöscht" });
      void refreshBetaUsers();
    },
    onError: (error) =>
      handleZodError(error.data?.zodError, error.message ?? "User konnte nicht gelöscht werden"),
  });

  const openDeleteModal = (userId: string) =>
    modals.openConfirmModal({
      title: "Wirklich löschen?",
      labels: { confirm: "Löschen", cancel: "Abbrechen" },
      centered: true,
      confirmProps: {
        color: "red",
      },
      onConfirm: () => deleteBetaUser(userId),
    });

  const handleAddBetaUser = form.onSubmit((values) => {
    addBetaUser(values.email);
  });

  const rows = betaUserList?.map((u) => (
    <tr key={u.id}>
      <td>{u.email}</td>
      <td>{formatTimestamp(u.createdAt)}</td>
      <td>
        <ActionIcon
          variant="outline"
          toolTip="Löschen"
          color="red"
          onClick={() => openDeleteModal(u.id)}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <PageLayout
      loadingMessage="Betatester werden geladen ..."
      showLoader={isLoading}
    >
      <Flex
        direction="column"
        gap="xl"
      >
        <Flex
          direction="column"
          gap="sm"
        >
          <Title order={4}>Neuen Betatester hinzufügen</Title>
          <form onSubmit={handleAddBetaUser}>
            <Flex gap="md">
              <TextInput
                withAsterisk
                w="30rem"
                placeholder="Email"
                {...form.getInputProps("email")}
              />
              <Button type="submit">Betatester hinzufügen</Button>
            </Flex>
          </form>
        </Flex>

        <Title order={4}>Alle Betatester</Title>
        <Table w="40rem">
          <thead>
            <tr>
              <th>Email</th>
              <th>Erstellt am</th>
            </tr>
          </thead>

          <tbody>{rows}</tbody>
        </Table>
      </Flex>
    </PageLayout>
  );
};

export default BetaUsersPage;
