import { createContext, useContext, useState } from "react";
import { type IRoom } from "~/pages/api/classes/Room/room.types";
import { type INonNullableUseRoomContext, type IUseRoomContext, type IUseRoomProvider } from "./useRoom.types";

const RoomContext = createContext<IUseRoomContext | undefined>(undefined);

const RoomProvider: React.FC<IUseRoomProvider> = ({ children }) => {
    const [room, setRoom] = useState<IRoom>()
    const currentGame = room?.games.find(g => g.identifier === room.currentGame)

    return (
        <RoomContext.Provider value={{ room, currentGame, setRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

const useRoom = () => {
    const context = useContext(RoomContext);

    if (context === undefined) {
        throw Error("useRoom must be used within RoomProvider");
    }

    // room will not be undefined in other components except in room component
    // -> in room, we catch the case if room is undefined
    return context as INonNullableUseRoomContext
};

export { RoomProvider, useRoom };

