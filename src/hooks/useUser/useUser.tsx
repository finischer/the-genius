import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ITeam } from "~/pages/api/classes/Team/team.types";
import { type TUserReduced } from "~/types/socket.types";
import { useRoom } from "../useRoom";
import { type IUseUserContext, type IUseUserProvider } from "./useUser.types";

const UserContext = createContext<IUseUserContext | undefined>(undefined);

const UserProvider: React.FC<IUseUserProvider> = ({ children }) => {
    const { data: session } = useSession()
    const { room } = useRoom()
    const [user, setUser] = useState<TUserReduced>(initUser())
    const [team, setTeam] = useState<ITeam | undefined>(undefined)
    const isPlayer = team !== undefined;
    const [isHost, setIsHost] = useState(false);

    function initUser() {
        const user: TUserReduced = {
            id: session?.user.id || "",
            name: session?.user.name || "",
            email: session?.user.email || "",
            image: session?.user.image || null,
            role: session?.user.role || "USER"
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

    useEffect(() => {
        setUser(initUser())
    }, [session])

    useEffect(() => {
        if (room) {
            initTeam()
        }
    }, [room, user])

    useEffect(() => {
        if (room && room.creator?.id === user?.id) {
            setIsHost(true)
        } else {
            setIsHost(false)
        }
    }, [room?.id])

    const setUserAsPlayer = (team: ITeam) => {
        setTeam(team)
    }

    return (
        <UserContext.Provider value={{ user, team, setUser, setUserAsPlayer, isPlayer, isHost }}>
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

