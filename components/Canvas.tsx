/** @jsx h */
/** @jsxFrag Fragment */
import { h, createContext, Fragment } from "preact";
import { useLayoutEffect, useRef, useState, useContext } from "preact/hooks";

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
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(innerWidth);
      setHeight(innerHeight);
    };
    contextRef.current = canvasRef.current?.getContext("2d") ?? null;
    setIsMounted(true);
    addEventListener("resize", handleResize);
    handleResize();
    return () => {
      setIsMounted(false);
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <CanvasContext.Provider value={canvasRef.current}>
      <Context2DContext.Provider value={contextRef.current}>
        <canvas ref={canvasRef} width={width} height={height} />
        <Fragment key={Number(new Date())}>
          {isMounted ? children : null}
        </Fragment>
      </Context2DContext.Provider>
    </CanvasContext.Provider>
  );
}
