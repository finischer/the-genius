import { Center, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArrowsExchange2,
  IconBan,
  IconDots,
  IconInfoCircle,
  IconSettings,
  IconTrash
} from "@tabler/icons-react";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import { NOT_FOUND_LITERAL } from "~/config/placeholder";
import { useUser } from "~/hooks/useUser";
import type { User } from "~/generated/prisma/client";

const ActionMenu = ({ user }: { user: User }) => {
  const { user: myself } = useUser();
  const disableAction = user.id === myself.id;

  const openUserDetails = () =>
    modals.openContextModal({
      modal: "userDetails",
      title: `Details zu: ${user.username ?? NOT_FOUND_LITERAL}`,
      w: "100%",
      h: "100%",
      bg: "blue",
      innerProps: {
        user
      }
    });

  const openChangeRoleModal = () => {
    modals.openContextModal({
      modal: "changeRole",
      title: `Rolle von "${user.username ?? NOT_FOUND_LITERAL}" ändern`,
      innerProps: {
        userId: user.id,
        role: user.role
      }
    });
  };

  return (
    <Menu width={200}>
      <ActionIcon toolTip="Aktionen anzeigen">
        <Menu.Target>
          <IconDots />
        </Menu.Target>
      </ActionIcon>

      <Menu.Dropdown>
        <Center>
          <Text my="sm">{user.username}</Text>
        </Center>
        <Menu.Label>Allgemein</Menu.Label>
        <Menu.Item
          leftSection={<IconInfoCircle size={14} />}
          onClick={openUserDetails}
        >
          Details anzeigen
        </Menu.Item>
        <Menu.Item
          disabled={disableAction}
          leftSection={<IconArrowsExchange2 size={14} />}
          onClick={openChangeRoleModal}
        >
          Rolle wechseln
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />} disabled>
          Bearbeiten
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item leftSection={<IconBan size={14} />} disabled>
          User bannen
        </Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={14} />} disabled>
          User löschen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionMenu;
