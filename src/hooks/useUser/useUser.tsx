import { Room, type User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { IUseUserContext, IUseUserProvider } from "./useUser.types";
import { useSession } from "next-auth/react";
import { type TUserReduced } from "~/types/socket.types";
import { ITeam } from "~/pages/api/classes/Team/team.types";
import { useRoom } from "../useRoom/useRoom";
import { type IRoom } from "~/pages/api/classes/Room/room.types";

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
            username: session?.user.name || "",
            email: session?.user.email || "",
            image: session?.user.image || null,
            role: session?.user.role || "USER"
        }

        return user
    }

    function initTeam() {
        let key: keyof IRoom["teams"]
        for (key in room?.teams) {
            const player = room?.teams[key].players.find(p => p.userId === user.id)
            if (player) setTeam(room?.teams[key])
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
        <UserContext.Provider value={{ user, setUser, setUserAsPlayer, isPlayer, isHost }}>
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

