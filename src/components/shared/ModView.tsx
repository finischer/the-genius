import React from "react";
import { useUser } from "~/hooks/useUser";

const ModView = ({ children }: { children: React.ReactNode }) => {
  const { isHost } = useUser();

  if (!isHost) return <></>;

  return <>{children}</>;
};

export default ModView;
