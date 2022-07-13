import { GameLoop } from "~/core/GameLoop.ts";
import { GameStateManager } from "~/core/GameState.ts";
import { LobbyState } from "./states/index.ts";
import { EntityManager } from "~/core/EntityManager.ts"
import { Entity } from "~/game/entities/Index.ts"
import { Camera } from "~/core/Camera.ts"


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
  const entityManager = new EntityManager();
  const camera = new Camera(entityManager, Math.floor(innerWidth / 2), Math.floor(innerHeight / 2));

  const lobby = new LobbyState("lobby", context, entityManager);
  // gameStateManager.add(lobby);
  // gameStateManager.change(lobby.name);

  const dingy = new Entity("DINGY", 100, 100, 10, 10);
  entityManager.add(dingy, 0);

  gameloop.on("step", (time) => {
    camera.update();
  });

  gameloop.on("render", () => {
    context.clearRect(0, 0, innerWidth, innerHeight);
    camera.draw(context);
  });

  console.log(gameloop);
  gameloop.start();
}