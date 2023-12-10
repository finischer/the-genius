import React from "react";
import UserList from "~/components/admin/feedbacks/users/UserList";
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

export default UsersPage;
