import React from "react";
import FeedbackHandler from "./shared/FeedbackHandler";
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