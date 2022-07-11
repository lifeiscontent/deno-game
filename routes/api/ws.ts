import type { RouteConfig, HandlerContext } from "$fresh/server.ts";
import { serialize } from "bson";

const rooms = new Map<string, Map<number, WebSocket>>();
const roomClientIds = new Map<string, number>();

function wsHandler(ws: WebSocket, roomId: string) {
  const id = roomClientIds.get(roomId)! + 1;
  roomClientIds.set(roomId, id);
  const clients = rooms.get(roomId)!;
  ws.onopen = (event) => {
    // console.log(event);
    clients.set(id, ws);
    ws.send(serialize({ clients: Array.from(clients.keys()) }));
  };
  ws.onclose = (event) => {
    // console.log(event);
    clients.delete(id);
    if (clients.size === 0) {
      rooms.delete(roomId);
      roomClientIds.delete(roomId);
    }
  };
  ws.onmessage = (event) => {
    // console.log(event);
  };
  ws.onerror = (event) => {
    // console.log(event);
  };
  ws.binaryType = "arraybuffer";
}

export function handler(req: Request, ctx: HandlerContext) {
  console.log(ctx.params.room);
  const { socket, response } = Deno.upgradeWebSocket(req);
  if (!roomClientIds.has(ctx.params.room)) {
    rooms.set(ctx.params.room, new Map());
    roomClientIds.set(ctx.params.room, 0);
  }
  wsHandler(socket, ctx.params.room);

  return response;
}

export const config: RouteConfig = {
  routeOverride: "/api/ws/:room",
};
