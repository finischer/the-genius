import type { Team } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { type TUserReduced } from "~/types/socket.types";
import { api } from "~/utils/api";
import useNotification from "../useNotification";
import { useRoom } from "../useRoom";
import { type IUseUserContext, type IUseUserProvider } from "./useUser.types";

const UserContext = createContext<IUseUserContext | undefined>(undefined);

const UserProvider: React.FC<IUseUserProvider> = ({ children }) => {
    const { data: session, update: updateSession } = useSession()
    const { room } = useRoom()
    const [user, setUser] = useState<TUserReduced>(initUser())
    const [team, setTeam] = useState<Team | undefined>(undefined)
    const isPlayer = team !== undefined;
    const [isHost, setIsHost] = useState(false);
    const { showErrorNotification } = useNotification()
    const { mutateAsync: checkUsername, isLoading } = api.users.isUsernameInUse.useMutation()

    function initUser() {
        const user: TUserReduced = {
            id: session?.user.id || "",
            name: session?.user.name || "",
            email: session?.user.email || "",
            image: session?.user.image || null,
            role: session?.user.role || "USER",
            username: session?.user.username || "NOT_FOUND"
        }

        return user
    }

    function initTeam() {
        const teamArray = Object.values(room?.teams)
        const teamPlayers = teamArray.map(t => t.players).flat() // all players in one array
        const player = teamPlayers.find(p => p.userId === user.id) // find the user in player array

        if (player) {
            // if user is a player, join team
            const team = teamArray.find(t => t.id === player.teamId)
            setTeam(team)
        }
    }

    async function updateUsername(newUsername: string) {
        if (newUsername === user.username) return true

        const usernameExists = await checkUsername({ username: newUsername })

        if (usernameExists) {
            showErrorNotification({
                message: `Username "${newUsername}" ist bereits vergeben 🙁`
            })
            return false
        }

        const newUser = { ...session, user: { ...session?.user, username: newUsername } }
        await updateSession(newUser)
        return true
    }

    useEffect(() => {
        setUser(initUser())
    }, [session])

    useEffect(() => {
        if (room) {
            initTeam()
        }
    }, [room, user])

    useEffect(() => {
        if (room && room.creatorId === user?.id) {
            setIsHost(true)
        } else {
            setIsHost(false)
        }
    }, [room?.id])

    const setUserAsPlayer = (team: Team) => {
        setTeam(team)
    }

    return (
        <UserContext.Provider value={{ user, team, setUser, setUserAsPlayer, isPlayer, isHost, updateUsername, isLoading }}>
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

