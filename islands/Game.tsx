/** @jsx h */
import "preact/debug";
import { h } from "preact";
import { useCallback, useEffect, useReducer, useState } from "preact/hooks";
import { Canvas, Context2dContext, Rect } from "~/components/index.ts";
import type { ApiMessage, ChannelMessage } from "~/messages/index.ts";
import type { Player } from "~/entities/index.ts";

type GameProps = unknown;

const PLAYER_SPEED = 0.5;

type GameState = {
  players: Player[];
};

const gameReducer = (state: GameState, message: ChannelMessage) => {
  switch (message.type) {
    case "addPlayer":
      return { ...state, players: [...state.players, message.player] };
    default:
      return state;
  }
};

export default function Game(props: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, { players: [] });

  useEffect(() => {
    const events = new EventSource(`/api/connect`);
    const listener = (e: MessageEvent) => {
      const msg: ChannelMessage = JSON.parse(e.data);
      dispatch(msg);
    };
    events.addEventListener("message", listener);
    return () => {
      events.removeEventListener("message", listener);
    };
  }, []);

  const sendMessage = useCallback((message: ApiMessage) => {
    fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(message),
    });
  }, []);

  useEffect(() => {
    sendMessage({
      type: "addPlayer",
      player: {
        name: `Player ${Math.ceil(Math.random() * 100)}`,
        color: `#${
          Math.ceil(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
        }`,
      },
    });
  }, []);

  useEffect(() => {
    let requestAnimationFrameId: number;
    let startTime = performance.now();
    const keys = { UP: false, DOWN: false, LEFT: false, RIGHT: false };
    const handleKeydown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.repeat) return;
      const pressed = event.type === "keydown";
      switch (event.key) {
        case "ArrowLeft":
          keys.LEFT = pressed;
          break;
        case "ArrowRight":
          keys.RIGHT = pressed;
          break;
        case "ArrowUp":
          keys.UP = pressed;
          break;
        case "ArrowDown":
          keys.DOWN = pressed;
          break;
      }
    };
    const loop = () => {
      const delta = performance.now() - startTime;
      // if (keys.LEFT) {
      //   setPlayerX((x) => x - delta * PLAYER_SPEED);
      // }
      // if (keys.RIGHT) {
      //   setPlayerX((x) => x + delta * PLAYER_SPEED);
      // }
      // if (keys.UP) {
      //   setPlayerY((y) => y - delta * PLAYER_SPEED);
      // }
      // if (keys.DOWN) {
      //   setPlayerY((y) => y + delta * PLAYER_SPEED);
      // }

      requestAnimationFrameId = requestAnimationFrame(loop);
      startTime = performance.now();
    };

    addEventListener("keydown", handleKeydown);
    addEventListener("keyup", handleKeydown);
    requestAnimationFrameId = requestAnimationFrame(loop);

    return () => {
      removeEventListener("keydown", handleKeydown);
      removeEventListener("keyup", handleKeydown);
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, []);

  return (
    <Canvas>
      <Context2dContext.Consumer>
        {(ctx) => {
          ctx?.clearRect(0, 0, ctx?.canvas.width ?? 0, ctx?.canvas.height ?? 0);

          return (
            <Rect
              fillStyle="red"
              x={0}
              y={0}
              width={ctx?.canvas.width ?? 0}
              height={ctx?.canvas.height ?? 0}
            >
              {state.players.map((player) => (
                <Rect
                  key={player.id}
                  width={50}
                  height={50}
                  fillStyle={player.color}
                  x={player.x}
                  y={player.y}
                />
              ))}
            </Rect>
          );
        }}
      </Context2dContext.Consumer>
    </Canvas>
  );
}
