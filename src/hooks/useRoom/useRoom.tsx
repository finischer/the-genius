import { createContext, useContext, useState } from "react";
import { type IUseRoomContext, type IUseRoomProvider } from "./useRoom.types";
import { type IRoom } from "~/pages/api/classes/Room/room.types";

const RoomContext = createContext<IUseRoomContext | undefined>(undefined);

const RoomProvider: React.FC<IUseRoomProvider> = ({ children }) => {
    const [room, setRoom] = useState<IRoom>()

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

const useRoom = () => {
    const context = useContext(RoomContext);

    if (context === undefined) {
        throw Error("useRoom must be used within RoomProvider");
    }
    return context;
};

export { RoomProvider, useRoom };

