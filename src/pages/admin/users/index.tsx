import UserList from "~/components/admin/UserList";
import withAdminAuth from "~/components/admin/withAdminAuth";
import PageLayout from "~/components/layout/PageLayout";

const UsersPage = () => {
  return (
    <PageLayout>
      <UserList />
    </PageLayout>
  );
};

export default withAdminAuth(UsersPage);
