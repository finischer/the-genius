import React, { useEffect } from "react";
import UserList from "~/components/admin/UserList";
import withAdminAuth from "~/components/admin/withAdminAuth";
import PageLayout from "~/components/layout";
import { api } from "~/utils/api";

const UsersPage = () => {
  const { data: users, isLoading } = api.users.getAll.useQuery();

  return (
    <PageLayout
      showLoader={isLoading}
      loadingMessage="User werden geladen ..."
    >
      {users && <UserList users={users} />}
    </PageLayout>
  );
};

export default withAdminAuth(UsersPage);
