import React from "react";
import type { User } from "~/generated/prisma/client";
import { ColumnType } from "~/components/shared/DataTable";
import type { TColumnDef } from "~/components/shared/DataTable";
import DataTable from "~/components/shared/DataTable";
import { RoleBadge } from "~/components/shared/Badge/Badge";
import { formatTimestamp } from "~/utils/dates";
import { api } from "~/utils/api";
import ActionMenu from "./ActionMenu";
import { modals } from "@mantine/modals";

const userColumns: TColumnDef<User>[] = [
  {
    key: "username",
    label: "User",
    type: ColumnType.Text,
    filterable: true,
    sortable: true
  },
  {
    key: "email",
    label: "Email",
    type: ColumnType.Email,
    filterable: true,
    sortable: true
  },
  {
    key: "role",
    label: "Rolle",
    type: ColumnType.Role,
    filterable: true,
    render: (user) => <RoleBadge role={user.role ?? "USER"} />
  },
  {
    key: "createdAt",
    label: "Dabei seit",
    type: ColumnType.Date,
    filterable: true,
    sortable: true,
    render: (user) => formatTimestamp(user.createdAt)
  },
  {
    key: "lastLoginAt",
    label: "Letzter Login",
    type: ColumnType.Date,
    filterable: true,
    sortable: true,
    render: (user) => formatTimestamp(user.lastLoginAt)
  },
  {
    key: "id",
    label: "Aktionen",
    type: ColumnType.Custom,
    render: (user) => <ActionMenu user={user} />
  }
];

const UserList: React.FC = () => {
  const openUserDetails = (user: User) => {
    modals.openContextModal({
      modal: "userDetails",
      innerProps: { user }
    });
  };

  return (
    <DataTable<User>
      columns={userColumns}
      queryFn={(input) => api.users.getAll.useQuery(input)}
      defaultPageSize={25}
      onRowClick={openUserDetails}
    />
  );
};

export default UserList;
