import { type User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { IUseUserContext, IUseUserProvider } from "./useUser.types";
import { useSession } from "next-auth/react";
import { type TUserReduced } from "~/types/socket.types";
import { ITeam } from "~/pages/api/classes/Team/team.types";

const UserContext = createContext<IUseUserContext | undefined>(undefined);

const UserProvider: React.FC<IUseUserProvider> = ({ children }) => {
    const { data: session } = useSession()
    const [user, setUser] = useState<TUserReduced | undefined>(undefined)
    const [team, setTeam] = useState<ITeam | undefined>(undefined)
    const isPlayer = team !== undefined;

    useEffect(() => {
        if (session?.user) {
            const user: TUserReduced = {
                id: session.user.id,
                username: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || null,
                role: session.user.role
            }

            setUser(user)
        }
    }, [session])

    const setUserAsPlayer = (team: ITeam) => {
        setTeam(team)
    }

    return (
        <UserContext.Provider value={{ user, setUser, setUserAsPlayer, isPlayer }}>
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

