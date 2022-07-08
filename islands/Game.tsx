/** @jsx h */
import "preact/debug";
import { h } from "preact";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "preact/hooks";
import { Canvas, Context2dContext, Rect } from "~/components/index.ts";
import type { ClientMessage, ServerMessage } from "~/messages/index.ts";
import type { Player } from "~/entities/index.ts";
import * as fx from "@fxts/core";

type GameProps = unknown;

type GameState = {
  playerId: Player["id"];
  playerIds: Set<Player["id"]>;
  players: Map<Player["id"], Player>;
};

const gameReducer = (state: GameState, message: ServerMessage) => {
  console.log(message);
  switch (message.type) {
    case "loadGameState":
      return {
        playerId: message.state.playerId,
        playerIds: new Set(message.state.playerIds),
        players: new Map(message.state.players),
      };
    case "addPlayer":
      return {
        ...state,
        playerIds: new Set([...state.playerIds, message.player.id]),
        players: new Map([...state.players, [
          message.player.id,
          message.player,
        ]]),
      };
    case "movePlayer": {
      const player = state.players.get(message.id);
      if (!player) return state;
      return {
        ...state,
        players: new Map(
          fx.map(
            (playerTuple) =>
              playerTuple[0] === message.id
                ? [message.id, {
                  ...playerTuple[1],
                  x: message.x,
                  y: message.y,
                }]
                : playerTuple,
            state.players,
          ),
        ),
      };
    }
    case "removePlayer":
      return {
        ...state,
        playerIds: new Set(
          fx.filter((id) => id !== message.id, state.playerIds),
        ),
        players: new Map(
          fx.filter(([id]) => id !== message.id, state.players),
        ),
      };
    default:
      return state;
  }
};

export default function Game(props: GameProps) {
  const [{ playerId, playerIds, players }, dispatch] = useReducer(gameReducer, {
    playerId: undefined,
    players: new Map(),
    playerIds: new Set(),
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = new URL("/api/ws", window.location.origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(url);
    socketRef.current = socket;

    const handleOpen = (event: Event) => {
      console.info(event);
    };
    const handleMessage = (event: MessageEvent) => {
      dispatch(JSON.parse(event.data));
    };
    const handleError = (event: Event) => {
      console.error(event);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socketRef.current = null;
      socket.close();
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      event.preventDefault();
      // if (event.repeat) return;
      switch (event.key) {
        case "ArrowLeft":
          socketRef.current?.send(
            JSON.stringify({ type: "playerInput", input: "left" }),
          );
          break;
        case "ArrowRight":
          socketRef.current?.send(
            JSON.stringify({ type: "playerInput", input: "right" }),
          );
          break;
        case "ArrowUp":
          socketRef.current?.send(
            JSON.stringify({ type: "playerInput", input: "up" }),
          );
          break;
        case "ArrowDown":
          socketRef.current?.send(
            JSON.stringify({ type: "playerInput", input: "down" }),
          );
          break;
      }
    };

    addEventListener("keydown", handleKeydown);
    addEventListener("keyup", handleKeydown);

    return () => {
      removeEventListener("keydown", handleKeydown);
      removeEventListener("keyup", handleKeydown);
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
              {Array.from(playerIds).map((id) => {
                const player = players.get(id)!;
                return (
                  <Rect
                    key={id}
                    width={50}
                    height={50}
                    fillStyle={player.color}
                    x={player.x}
                    y={player.y}
                  />
                );
              })}
            </Rect>
          );
        }}
      </Context2dContext.Consumer>
    </Canvas>
  );
}
