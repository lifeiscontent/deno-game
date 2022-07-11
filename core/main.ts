import { GameLoop } from "./GameLoop.ts";
import { GameState, GameStateManager } from "./GameState.ts";

export function main(
  room: string,
  canvas: HTMLCanvasElement,
  _socket: WebSocket
) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get context");
  }

  const gameloop = new GameLoop(room);
  const gameStateManager = new GameStateManager(gameloop);

  const lobby = new LobbyState("lobby", context);
  gameStateManager.add(lobby);
  gameStateManager.change(lobby.name);

  console.log(gameloop);
  gameloop.start();
}

class LobbyState extends GameState {
  tick() {}
  step() {}
  render() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.fillText("Welcome to the lobby", 100, 100);
  }
  enter() {
    console.log("Joined the lobby");
  }
  leave() {
    console.log("Left the lobby the lobby");
  }
}
