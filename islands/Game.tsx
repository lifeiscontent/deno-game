/** @jsx h */
import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { deserialize } from "bson";
import { main } from "~/game/main.ts";

export default function Game({ room }: { room: string }) {
  const socketRef = useRef<WebSocket | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const url = new URL(`/api/ws/${room}`, window.location.origin);
    url.protocol = url.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(url);
    const handleOpen = (event: Event) => {
      console.log(event);
    };
    const handleClose = (event: Event) => {
      console.log(event);
    };
    const handleMessage = (event: MessageEvent) => {
      console.log(deserialize(event.data));
    };
    const handleError = (event: Event) => {
      console.log(event);
    };
    socket.binaryType = "arraybuffer";
    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socketRef.current = socket;

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.close();
      socketRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ref.current || !socketRef.current) return;
    const canvas = ref.current;
    const socket = socketRef.current;
    main(room, canvas, socket);
  }, []);

  return <canvas ref={ref} />;
}
