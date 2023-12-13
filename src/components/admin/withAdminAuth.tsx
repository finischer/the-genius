import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useNotification from "~/hooks/useNotification";
import { useUser } from "~/hooks/useUser";

const withAdminAuth = <P extends object>(Component: NextPage) => {
  const Auth = (props: JSX.IntrinsicAttributes & P) => {
    // Login data added to props via redux-store (or use react context for example)
    const { isAdmin } = useUser();
    const router = useRouter();
    const { showErrorNotification } = useNotification();

    useEffect(() => {
      if (!isAdmin) {
        showErrorNotification({
          message: "Du darfst auf diese Seite nicht zugreifen",
        });
        void router.push("/");
      }
    }, []);

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (void Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAdminAuth;
