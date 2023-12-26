import React from "react";
import IntroductionBanner from "./shared/IntroductionBanner";
import FeedbackHandler from "./shared/FeedbackHandler";

interface IAuthenticatedLayout {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<IAuthenticatedLayout> = ({ children }) => {
  return (
    <>
      <IntroductionBanner />
      {/* FeedbackHandler only during beta phase */}
      <FeedbackHandler />
      {children}
    </>
  );
};

export default AuthenticatedLayout;
