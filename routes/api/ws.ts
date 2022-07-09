import type { Player } from "~/entities/index.ts";
import { ClientMessage, ServerMessage } from "~/messaging/types.ts";
import { deserializeMessage, serializeMessage } from "~/messaging/server.ts";

const players = new Map<Player["id"], Player>();

const clients = new Map<number, WebSocket>();
let clientId = 0;

function dispatch(msg: ServerMessage): void {
  for (const client of clients.values()) {
    client.send(serializeMessage(msg));
  }
}

function dispatchOthers(msg: ServerMessage, current: WebSocket): void {
  for (const client of clients.values()) {
    if (current !== client) {
      client.send(serializeMessage(msg));
    }
  }
}

function wsHandler(ws: WebSocket) {
  const playerId = ++clientId;
  ws.onopen = () => {
    ws.send(
      serializeMessage({
        type: "handshake",
        generation: Infinity,
        id: playerId,
      }),
    );
    for (const player of players.values()) {
      if (player.id === playerId) continue;
      ws.send(serializeMessage({
        type: "addPlayer",
        generation: Infinity,
        player: player,
      }));
    }
    clients.set(playerId, ws);
  };

  ws.onmessage = (e) => {
    const message = deserializeMessage(e.data);
    switch (message.type) {
      case "addPlayer":
        players.set(message.player.id, message.player);
        dispatchOthers(message, ws);
        break;
      case "updatePlayer":
        players.set(message.player.id, message.player);
        dispatch({
          type: "updatePlayer",
          player: message.player,
          generation: message.generation,
        });
        break;
      default:
        console.info(`Unknown message: ${JSON.stringify(message)}`);
    }
  };

  ws.onclose = () => {
    dispatchOthers(
      { type: "removePlayer", id: playerId, generation: Infinity },
      ws,
    );
    clients.delete(playerId);
    players.delete(playerId);
  };
  ws.binaryType = "arraybuffer";
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket);
  return response;
};
