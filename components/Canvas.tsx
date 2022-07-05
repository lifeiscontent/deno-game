/** @jsx h */
/** @jsxFrag Fragment */
import { h, createContext } from "preact";
import { useEffect, useRef, useState, useContext } from "preact/hooks";

const CanvasContext = createContext<HTMLCanvasElement | null>(null);
const Context2DContext = createContext<CanvasRenderingContext2D | null>(null);

export function useCanvas() {
  const canvas = useContext(CanvasContext);
  if (!canvas) {
    throw new Error("useCanvas must be used within a Canvas component");
  }

  return canvas;
}

export function useContext2d() {
  const context2d = useContext(Context2DContext);
  if (!context2d) {
    throw new Error("useContext must be used within a Canvas component");
  }

  return context2d;
}

export function Canvas({ children }: { children: preact.ComponentChildren }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    contextRef.current = canvasRef.current?.getContext("2d") ?? null;
    setIsMounted(true);
  }, []);

  return (
    <CanvasContext.Provider value={canvasRef.current}>
      <Context2DContext.Provider value={contextRef.current}>
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        {isMounted ? children : null}
      </Context2DContext.Provider>
    </CanvasContext.Provider>
  );
}
