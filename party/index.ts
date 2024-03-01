import type * as Party from "partykit/server";
import type Room from "~/pages/api/classes/Room";

export default class Server implements Party.Server {
  constructor(readonly partyRoom: Party.Room) {}

  room: Room | undefined;

  async onRequest(req: Party.Request) {
    console.log("New Request: ", req.url);
    console.log("Current room: ", this.room);
    if (req.method === "POST") {
      const room = (await req.json()) as Room;
      this.room = room;
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

    const url = new URL(ctx.request.url);

    const username = url.searchParams.get("username");

    this.partyRoom.broadcast(`${username} joined the room`, [conn.id]);
    // let's send a message to the connection
    conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.partyRoom.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
