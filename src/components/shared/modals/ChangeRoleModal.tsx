import { Button, Flex, Select } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { UserRole } from "@prisma/client";
import React, { useState } from "react";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";

interface IChangeRoleModalProps {
  role: UserRole | null;
  userId: string;
}

const ChangeRoleModal: React.FC<ContextModalProps<IChangeRoleModalProps>> = ({ id, innerProps, context }) => {
  const { showSuccessNotification, handleZodError, showInfoNotification } = useNotification();
  const { mutate: updateRole } = api.users.updateUserRole.useMutation({
    onSuccess: () => showSuccessNotification({ message: "Rolle wurde erfolgreich geändert" }),
    onError: (error) => {
      handleZodError(error.data?.zodError, error.message ?? "Die Rolle konnte nicht geändert werden");
    },
  });

  const { role, userId } = innerProps;
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);

  const allRoles = Object.keys(UserRole);

  const handleChangeRole = () => {
    if (!selectedRole) {
      return showInfoNotification({
        message: "Die aktuelle Rolle konnte nicht abgerufen werden und kann daher nicht geändert werden.",
      });
    }

    updateRole({
      userId,
      newRole: selectedRole,
    });

    context.closeModal(id);
  };

  return (
    <Flex
      h={`${allRoles.length * 5}rem`}
      direction="column"
      gap="xl"
      justify="space-between"
    >
      <Select
        label="Wähle eine Rolle aus"
        placeholder="Rolle auswählen"
        data={allRoles}
        comboboxProps={{ position: "bottom" }}
        defaultValue={selectedRole}
        onChange={(role) => role !== null && setSelectedRole(role as UserRole)}
      />

      <Button
        fullWidth
        disabled={role === selectedRole}
        onClick={handleChangeRole}
      >
        Rolle ändern
      </Button>
    </Flex>
  );
};

export default ChangeRoleModal;
