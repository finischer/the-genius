import UserList from "~/compositions/admin/UserList";
import withAdminAuth from "~/compositions/admin/withAdminAuth";
import PageLayout from "~/compositions/layout/PageLayout";

const UsersPage = () => {
  return (
    <PageLayout>
      <UserList />
    </PageLayout>
  );
};

export default withAdminAuth(UsersPage);
