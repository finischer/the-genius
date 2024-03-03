import type * as Party from "partykit/server";

export type Room = {
  name: string;
  password: string;
};

export default class Server implements Party.Server {
  constructor(readonly partyRoom: Party.Room) {}

  room: Room | undefined;

  async onRequest(req: Party.Request) {
    console.log("New Request: ", req.url);
    console.log("Current room: ", this.room);
    if (req.method === "POST") {
      const room = (await req.json()) as Room;
      this.room = room;
      this.saveRoom();
    }

    if (this.room) {
      return new Response(JSON.stringify(this.room), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.partyRoom.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // const url = new URL(ctx.request.url);

    // const username = url.searchParams.get("username");

    // this.partyRoom.broadcast(`${username} joined the room`, [conn.id]);
    // let's send a message to the connection
  }

  onMessage(message: string, sender: Party.Connection) {
    if (!this.room) return;

    this.room = JSON.parse(message) as unknown as Room;
    this.partyRoom.broadcast(JSON.stringify(this.room));
    this.saveRoom();
  }

  async onStart() {
    this.room = await this.partyRoom.storage.get<Room>("room");
  }

  async saveRoom() {
    if (this.room) {
      await this.partyRoom.storage.put<Room>("room", this.room);
    }
  }
}

Server satisfies Party.Worker;
