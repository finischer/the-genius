import { Avatar, Checkbox, Group, Menu, Table, Text, rem } from "@mantine/core";
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

const ActionMenu = ({ user }: { user: User }) => {
  const openUserDetails = () =>
    modals.openContextModal({
      modal: "userDetails",
      title: `Details zu: ${user.username}`,
      w: "100%",
      h: "100%",
      bg: "blue",
      innerProps: {
        user,
      },
    });

  return (
    <Menu width={200}>
      <ActionIcon toolTip="Aktionen anzeigen">
        <Menu.Target>
          <IconDots />
        </Menu.Target>
      </ActionIcon>

      <Menu.Dropdown>
        <Text
          align="center"
          my="sm"
        >
          {user.username}
        </Text>
        <Menu.Label>Allgemein</Menu.Label>
        <Menu.Item
          icon={<IconInfoCircle size={14} />}
          onClick={openUserDetails}
        >
          Details anzeigen
        </Menu.Item>
        <Menu.Item icon={<IconArrowsExchange2 size={14} />}>Rolle wechseln</Menu.Item>
        <Menu.Item icon={<IconSettings size={14} />}>Bearbeiten</Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconBan size={14} />}>User bannen</Menu.Item>
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
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
          <Group spacing="sm">
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
        <td>{formatTimestamp(user.createdAt.toString())}</td>
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
          <th>Dabei seit</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UserList;
