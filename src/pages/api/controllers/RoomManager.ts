import type Room from "../classes/Room";

interface IRoomManager {
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  getRoom: (roomId: string) => Room | undefined;
  getRooms: () => Map<string, Room>;
  getRoomsAsArray: () => Room[];
}

class RoomManager implements IRoomManager {
  _rooms = new Map<string, Room>();

  addRoom(room: Room) {
    // TODO: create room in database
    this._rooms.set(room.id, room);
  }

  removeRoom(roomId: Room["id"]) {
    // TODO: remove room in database
    this._rooms.delete(roomId);
  }

  getRoom(roomId: Room["id"] | undefined | null) {
    if (!roomId) return undefined;

    return this._rooms.get(roomId);
  }

  getRooms() {
    return this._rooms;
  }

  getRoomsAsArray() {
    return Array.from(this._rooms.values());
  }
}

export const roomManager = new RoomManager();
