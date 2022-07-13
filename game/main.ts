import { GameLoop } from "~/core/GameLoop.ts";
import { GameStateManager } from "~/core/GameState.ts";
import { LobbyState } from "./states/index.ts";


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