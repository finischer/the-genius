import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import IntroductionBanner from "./shared/IntroductionBanner";

interface IAuthenticatedLayout {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<IAuthenticatedLayout> = ({ children }) => {
  return (
    <>
      <IntroductionBanner />
      {children}
    </>
  );
};

export default AuthenticatedLayout;
