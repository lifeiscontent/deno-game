/** @jsx h */
/** @jsxFrag Fragment */
import "preact/debug";
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Canvas, Context2dContext, Rect } from "~/components/index.ts";
import { ServerMessage } from "~/messaging/types.ts";
import { deserializeMessage, serializeMessage } from "~/messaging/client.ts";
import type { Player } from "~/entities/index.ts";

type GameProps = unknown;

const PLAYER_SPEED = 0.2;

export default function Game(props: GameProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [id, setId] = useState<Player["id"]>();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [generation, setGeneration] = useState(0);
  const generationRef = useRef(generation);
  const playerIdRef = useRef<Player["id"]>();
  generationRef.current = generation;

  const socketRef = useRef<WebSocket | null>(null);

  const dispatch = (message: ServerMessage) => {
    if (!playerIdRef.current && message.type === "handshake") {
      setId(message.id);
      return;
    }
    switch (message.type) {
      case "addPlayer":
        setPlayers((players) => [...players, message.player]);
        break;
      case "updatePlayer": {
        if (message.player.id === playerIdRef.current) {
          if (message.generation >= generationRef.current - 1) {
            setX(message.player.x);
            setY(message.player.y);
          }
        } else {
          setPlayers((players) =>
            players.map((player) =>
              player.id === message.player.id
                ? { ...player, x: message.player.x, y: message.player.y }
                : player
            )
          );
        }
        break;
      }
      case "removePlayer":
        setPlayers((players) =>
          players.filter((player) => player.id !== message.id)
        );
        break;
    }
  };

  useEffect(() => {
    if (id === undefined) return;
    if (playerIdRef.current) {
      socketRef.current?.send(
        serializeMessage({
          type: "updatePlayer",
          generation: generationRef.current,
          player: {
            id,
            x,
            y,
          },
        }),
      );
    } else {
      socketRef.current?.send(
        serializeMessage({
          type: "addPlayer",
          generation: generationRef.current,
          player: {
            id,
            x,
            y,
          },
        }),
      );
      playerIdRef.current = id;
    }
    setGeneration((g) => g + 1);
  }, [x, y, id]);

  useEffect(() => {
    const url = new URL("/api/ws", window.location.origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(url);
    socketRef.current = socket;

    const handleOpen = (event: Event) => {
      console.info(event);
    };
    const handleMessage = (event: MessageEvent) => {
      dispatch(deserializeMessage(event.data));
    };
    const handleError = (event: Event) => {
      console.error(event);
    };

    socket.binaryType = "arraybuffer";

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socketRef.current = null;
      playerIdRef.current = undefined;
      socket.close();
    };
  }, []);

  useEffect(() => {
    let requestAnimationFrameHandle: number;
    const keys = { UP: false, DOWN: false, LEFT: false, RIGHT: false };
    const handleKey = (event: KeyboardEvent) => {
      event.preventDefault();
      const pressed = event.type === "keydown";
      if (event.repeat) return;
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

    let lastFrame = performance.now();

    const loop = () => {
      const now = performance.now();
      const delta = now - lastFrame;
      if (keys.UP) setY((y) => y - delta * PLAYER_SPEED);
      if (keys.DOWN) setY((y) => y + delta * PLAYER_SPEED);
      if (keys.LEFT) setX((x) => x - delta * PLAYER_SPEED);
      if (keys.RIGHT) setX((x) => x + delta * PLAYER_SPEED);
      lastFrame = now;
      requestAnimationFrameHandle = requestAnimationFrame(loop);
    };

    addEventListener("keydown", handleKey);
    addEventListener("keyup", handleKey);

    requestAnimationFrameHandle = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestAnimationFrameHandle);
      removeEventListener("keydown", handleKey);
      removeEventListener("keyup", handleKey);
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
              {players.map((player) => (
                <Rect
                  key={player.id}
                  width={50}
                  height={50}
                  fillStyle="green"
                  x={player.x}
                  y={player.y}
                />
              ))}
              {id !== undefined && (
                <Rect
                  key={id}
                  width={50}
                  height={50}
                  fillStyle="blue"
                  x={x}
                  y={y}
                />
              )}
            </Rect>
          );
        }}
      </Context2dContext.Consumer>
    </Canvas>
  );
}
