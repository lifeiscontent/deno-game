import { useContext2d } from "./Canvas.tsx";

export type RectProps = {
  children?: preact.ComponentChildren;
  fillRule?: CanvasFillRule;
  fillStyle: string | CanvasGradient | CanvasPattern;
  height: number;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  width: number;
  x: number;
  y: number;
};

export function Rect({
  children,
  fillRule,
  fillStyle,
  height,
  strokeStyle,
  width,
  x,
  y,
}: RectProps) {
  const ctx = useContext2d();

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill(fillRule);
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }

  ctx.closePath();

  return children as preact.JSX.Element;
}
