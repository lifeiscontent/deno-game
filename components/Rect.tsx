import { useContext2d } from "./Canvas.tsx";

export type RectProps = {
  children?: null | preact.JSX.Element;
  fillColor: string | CanvasGradient | CanvasPattern;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
};

export function Rect({
  children = null,
  fillColor,
  height: controlledHeight = -1,
  width: controlledWidth = -1,
  x = 0,
  y = 0,
}: RectProps) {
  const context2d = useContext2d();
  const width =
    controlledWidth === -1 ? context2d.canvas.width : controlledWidth;
  const height =
    controlledHeight === -1 ? context2d.canvas.height : controlledHeight;
  context2d.fillStyle = fillColor;
  context2d.fillRect(x, y, width, height);

  return children;
}
