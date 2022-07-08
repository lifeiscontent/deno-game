import type { Player } from "~/entities/index.ts";
import type { ClientMessage, ServerMessage } from "~/messages/index.ts";

const players = new Map<Player["id"], Player>();

const clients = new Map<number, WebSocket>();
let clientId = 0;

function dispatch(msg: ServerMessage): void {
  for (const client of clients.values()) {
    client.send(JSON.stringify(msg));
  }
}

function wsHandler(ws: WebSocket) {
  const id = ++clientId;
  ws.onopen = () => {
    const player = {
      id,
      color: `#${
        Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
      }`,
      name: `Player ${id}`,
      x: Math.ceil(Math.random() * 255),
      y: Math.ceil(Math.random() * 255),
    };
    players.set(id, player);
    ws.send(
      JSON.stringify({
        type: "loadGameState",
        timestamp: Date.now(),
        state: {
          id,
          players: Array.from(players),
          playerIds: Array.from(players.keys()),
        },
      }),
    );
    dispatch({
      type: "addPlayer",
      timestamp: Date.now(),
      player,
    });
    clients.set(id, ws);
  };

  ws.onmessage = (e) => {
    const message: ClientMessage = JSON.parse(e.data);
    switch (message.type) {
      case "playerInput": {
        const player = players.get(id)!;
        switch (message.input) {
          case "up":
            player.y -= 10;
            break;
          case "down":
            player.y += 10;
            break;
          case "left":
            player.x -= 10;
            break;
          case "right":
            player.x += 10;
            break;
        }
        dispatch({
          type: "movePlayer",
          id,
          x: player.x,
          y: player.y,
          timestamp: Date.now(),
        });
        break;
      }
      default:
        console.info(`Unknown message: ${e.data}`);
    }
  };

  ws.onclose = () => {
    clients.delete(id);
    players.delete(id);
    dispatch({ type: "removePlayer", id, timestamp: Date.now() });
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket);
  return response;
};
