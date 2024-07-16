import React from "react";

interface IAuthenticatedLayout {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<IAuthenticatedLayout> = ({ children }) => {
  return <>{children}</>;
};

export default AuthenticatedLayout;
