import type Room from "../classes/Room";

interface IRoomManager {
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  getRoom: (roomId: string) => Room | undefined;
  getRooms: () => Map<string, Room>;
  getRoomsAsArray: () => [string, Room][];
}

class RoomManager implements IRoomManager {
  _rooms = new Map<string, Room>();

  addRoom(room: Room) {
    this._rooms.set(room.id, room);
  }

  removeRoom(roomId: Room["id"]) {
    this._rooms.delete(roomId);
  }

  getRoom(roomId: Room["id"]) {
    return this._rooms.get(roomId);
  }

  getRooms() {
    return this._rooms;
  }

  getRoomsAsArray() {
    return Array.from(this._rooms);
  }
}

export const roomManager = new RoomManager();
