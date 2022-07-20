const clients = new Map<number, Client>();
const entities = new Map<number, Entity>();
let clientId = 0;
let entityId = 0;

const width = 480;
const height = 640;

const buffer = new ArrayBuffer(width * height * 4);
const view = new Uint32Array(buffer).fill(0xff000000);
const decoder = new TextDecoder();

class Client {
  entities: Map<number, Entity> = new Map();
  constructor(public id: number, public ws: WebSocket) {}
  onInput(keys: string[]) {
    for (const entity of this.entities.values()) {
      entity.onInput(keys);
    }
  }
}

interface Entity {
  draw(view: Uint32Array): void;
  onInput(keys: string[]): void;
}

class Player implements Entity {
  constructor(
    private id: number,
    private playerId: number,
    private x: number,
    private y: number
  ) {}
  private width = 10;
  private height = 10;
  private data = new Uint32Array(this.width * this.height * 4).fill(0xff0000ff);
  onInput(keys: string[]) {
    if (keys.includes("ArrowLeft")) {
      this.x -= 1;
    }
    if (keys.includes("ArrowRight")) {
      this.x += 1;
    }
    if (keys.includes("ArrowUp")) {
      this.y -= 1;
    }
    if (keys.includes("ArrowDown")) {
      this.y += 1;
    }
  }

  draw(view: Uint32Array) {
    for (let y = this.y, localY = 0; y < this.y + this.height; y++, localY++) {
      for (let x = this.x, localX = 0; x < this.x + this.width; x++, localX++) {
        view[y * height + x] = this.data[localY * this.height + localX];
      }
    }
  }
}

setInterval(() => {
  view.fill(0xff000000);

  for (const entity of entities.values()) {
    entity.draw(view);
  }

  for (const client of clients.values()) {
    client.ws.send(view);
  }
}, 1000 / 60);

function wsHandler(ws: WebSocket) {
  const id = ++clientId;
  const playerEntityId = ++entityId;
  const client = new Client(id, ws);
  const player = new Player(playerEntityId, id, 0, 0);
  ws.onopen = (event) => {
    client.entities.set(playerEntityId, player);
    entities.set(playerEntityId, player);
    clients.set(id, client);
  };
  ws.onclose = (event) => {
    clients.delete(id);
    entities.delete(playerEntityId);
  };
  ws.onmessage = (event) => {
    const inputs = decoder.decode(event.data).split(",");
    client.onInput(inputs);
  };
  ws.onerror = (event) => {
    // console.log(event);
  };
  ws.binaryType = "arraybuffer";
}

export function handler(req: Request) {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket);

  return response;
}

// export const config: RouteConfig = {
//   routeOverride: "/api/ws",
// };
