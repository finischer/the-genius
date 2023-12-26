import { Button, Divider, Flex, Select, Text, rem } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import React, { useState } from "react";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";

interface IChangeRoleModalProps extends ContextModalProps<any> {
  role: UserRole;
  userId: string;
}

const ChangeRoleModal: React.FC<ContextModalProps<IChangeRoleModalProps>> = ({ id, innerProps, context }) => {
  const { showSuccessNotification, handleZodError } = useNotification();
  const { mutate: updateRole } = api.users.updateUserRole.useMutation({
    onSuccess: () => showSuccessNotification({ message: "Rolle wurde erfolgreich geändert" }),
    onError: (error) => {
      handleZodError(error.data?.zodError, error.message ?? "Die Rolle konnte nicht geändert werden");
    },
  });

  const { role, userId } = innerProps;
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);

  const allRoles = Object.keys(UserRole);

  const handleChangeRole = () => {
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
        dropdownPosition="bottom"
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
