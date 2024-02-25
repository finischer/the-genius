import { Avatar, Center, Checkbox, Group, Menu, Table, Text, rem } from "@mantine/core";
import type { User } from "@prisma/client";
import {
  IconArrowsExchange2,
  IconBan,
  IconDots,
  IconInfoCircle,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import React, { useState } from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import { RoleBadge } from "~/components/shared/Badge/Badge";
import { formatTimestamp } from "~/utils/dates";
import type { IUserListProps } from "./userList.types";
import { modals } from "@mantine/modals";
import { useUser } from "~/hooks/useUser";
import { NOT_FOUND_LITERAL } from "~/config/placeholder";

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
        user,
      },
    });

  const openChangeRoleModal = () => {
    modals.openContextModal({
      modal: "changeRole",

      title: `Rolle von "${user.username ?? NOT_FOUND_LITERAL}" ändern`,
      innerProps: {
        userId: user.id,
        role: user.role,
      },
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
        <Menu.Item
          leftSection={<IconSettings size={14} />}
          disabled
        >
          Bearbeiten
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={<IconBan size={14} />}
          disabled
        >
          User bannen
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
          disabled
        >
          User löschen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const UserList: React.FC<IUserListProps> = ({ users }) => {
  const [selection, setSelection] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === users.length ? [] : users.map((item) => item.id)));

  const rows = users.map((user) => {
    const selected = selection.includes(user.id);
    return (
      <tr key={user.id}>
        <td>
          <Checkbox
            checked={selection.includes(user.id)}
            onChange={() => toggleRow(user.id)}
          />
        </td>
        <td>
          <Group gap="sm">
            <Avatar
              size={26}
              src={user.image}
              radius={26}
            />
            <Text
              size="sm"
              fw={500}
            >
              {user.username}
            </Text>
          </Group>
        </td>
        <td>{user.email}</td>
        <td>
          <Group>
            <RoleBadge role={user.role ?? "USER"} />
            {user.role}
          </Group>
        </td>
        <td>{formatTimestamp(user.lastLoginAt)}</td>
        <td>{formatTimestamp(user.createdAt)}</td>
        <td>
          <ActionMenu user={user} />
        </td>
      </tr>
    );
  });

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th style={{ width: rem(40) }}>
            <Checkbox
              onChange={toggleAll}
              checked={selection.length === users.length}
              indeterminate={selection.length > 0 && selection.length !== users.length}
            />
          </th>
          <th>User</th>
          <th>Email</th>
          <th>Rolle</th>
          <th>Letzter login</th>
          <th>Dabei seit</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UserList;
