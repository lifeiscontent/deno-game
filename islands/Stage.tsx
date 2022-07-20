/** @jsx h */
import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";

const width = 640;
const height = 480;
const FPS = 1000 / 60;

const encoder = new TextEncoder();

export default function Stage() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;

    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    const url = new URL("/api/ws", window.location.origin);
    url.protocol = url.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(url);
    const keyMap = new Set<string>();
    let frameHandle: number;

    const handleClose = (event: Event) => {
      cancelAnimationFrame(frameHandle);
    };
    const handleError = (event: Event) => {};
    const handleMessage = (event: MessageEvent) => {
      const view = new Uint8Array(
        event.data,
      );
      // console.log(view);
      image.data.set(view);
      ctx.putImageData(image, 0, 0);
    };
    const handleOpen = (event: Event) => {
      loop();
    };

    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("open", handleOpen);
    socket.binaryType = "arraybuffer";
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      keyMap.add(event.key);
    });
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      keyMap.delete(event.key);
    });

    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = now - lastTime;
      if (delta > FPS) {
        const keys = Array.from(keyMap).join(",");
        socket.send(encoder.encode(keys));
        lastTime = now;
      }
      frameHandle = requestAnimationFrame(loop);
    };

    return () => {
      socket.close();
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("open", handleOpen);
    };
  }, []);
  return <canvas ref={ref} width={480} height={640} />;
}
