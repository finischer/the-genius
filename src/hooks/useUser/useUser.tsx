import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Player, Team } from "~/types/gameshow.types";
import { type TUserReduced } from "~/types/socket.types";
import type { FunctionToWrap } from "~/types/types";
import { api } from "~/utils/api";
import useNotification from "../useNotification";
import useSyncedRoom from "../useSyncedRoom";
import { type IUseUserContext, type IUseUserProvider } from "./useUser.types";

const UserContext = createContext<IUseUserContext | undefined>(undefined);

const UserProvider: React.FC<IUseUserProvider> = ({ children }) => {
  const { data: session, update: updateSession } = useSession();

  const room = useSyncedRoom();
  const [user, setUser] = useState<TUserReduced>(initUser());

  const player = getPlayer();
  const isPlayer = !!player;

  const team = getTeam();
  const isInTeam = !!team;

  const { showErrorNotification, showSuccessNotification } = useNotification();
  const { mutateAsync: checkUsername, isLoading } = api.users.isUsernameInUse.useMutation();

  const isAdmin = user.role === "ADMIN";
  const isHost = room.creatorId === user.id;

  function initUser() {
    const user: TUserReduced = {
      id: session?.user.id || "",
      name: session?.user.name || "",
      email: session?.user.email || "",
      image: session?.user.image || null,
      role: session?.user.role || "USER",
      username: session?.user.username || "NOT_FOUND",
    };

    return user;
  }

  function getPlayer() {
    if (!room || !room.teams) return;

    const teams = Object.values(room.teams);
    const players = teams.map((team) => team.players).flat();

    return players.find((player) => player.userId === user.id);
  }

  function getTeam() {
    if (!room || !room.teams || !isPlayer) return;

    const team = Object.values(room.teams).find((team) => team.id === player.teamId);

    return team;
  }

  async function updateUsername(newUsername: string) {
    if (newUsername === user.username) return true;

    const usernameExists = await checkUsername({ username: newUsername });

    if (usernameExists) {
      showErrorNotification({
        message: `Username "${newUsername}" ist bereits vergeben 🙁`,
      });
      return false;
    }

    const newUser = { ...session, user: { ...session?.user, username: newUsername } };
    await updateSession(newUser);

    showSuccessNotification({
      message: "Username erfolgreich geändert",
    });
    return true;
  }

  function hostFunction<T extends any[]>(func: FunctionToWrap<T>): FunctionToWrap<T> {
    if (!isHost) return () => null;
    return (...args: T) => func(...args);
  }

  function playerFunction(func: (team: Team, player: Player) => void): () => void {
    if (!isPlayer) return () => null;

    if (!team) return () => null;

    return () => func(team, player);
  }

  useEffect(() => {
    setUser(initUser());
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user,
        team,
        isInTeam,
        player,
        setUser,
        isPlayer,
        isHost,
        isAdmin,
        updateUsername,
        isLoading,
        hostFunction,
        playerFunction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw Error("useUser must be used within UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
