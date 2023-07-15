import Room from "../classes/Room";

class RoomManager {
  _rooms = new Map();

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
