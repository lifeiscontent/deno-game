/** @jsx h */
/** @jsxFrag Fragment */
import { createContext, Fragment, h } from "preact";
import type { ComponentChildren } from "preact";
import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";

const CanvasContext = createContext<HTMLCanvasElement | null>(null);
export const Context2dContext = createContext<CanvasRenderingContext2D | null>(
  null,
);

export function useCanvas() {
  const canvas = useContext(CanvasContext);
  if (!canvas) {
    throw new Error("useCanvas must be used within a Canvas component");
  }

  return canvas;
}

export function useContext2d() {
  const context2d = useContext(Context2dContext);
  if (!context2d) {
    throw new Error("useContext must be used within a Canvas component");
  }

  return context2d;
}

export type CanvasProps = { children?: ComponentChildren };

export function Canvas({ children = null }: CanvasProps) {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null,
  );
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(innerWidth);
      setHeight(innerHeight);
    };
    addEventListener("resize", handleResize);
    handleResize();
    return () => {
      removeEventListener("resize", handleResize);
    };
  }, [canvasElement]);

  const context2d = useMemo(
    () => canvasElement?.getContext("2d") ?? null,
    [canvasElement],
  );

  return (
    <CanvasContext.Provider value={canvasElement}>
      <Context2dContext.Provider value={context2d}>
        <canvas ref={setCanvasElement} width={width} height={height} />
        <Fragment key={`${width}x${height}`}>
          {canvasElement ? children : null}
        </Fragment>
      </Context2dContext.Provider>
    </CanvasContext.Provider>
  );
}
