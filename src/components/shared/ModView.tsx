import React from "react";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";

const ModView = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const room = useSyncedRoom();

  const isModerator = user.id === room.creatorId;

  if (!isModerator) return <></>;

  return <>{children}</>;
};

export default ModView;
