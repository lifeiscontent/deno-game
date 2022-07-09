import { useContext2d } from "./Canvas.tsx";

export type ArcProps = {
  children?: preact.ComponentChildren;
  counterclockwise?: boolean;
  endAngle: number;
  fillRule?: CanvasFillRule;
  fillStyle: string | CanvasGradient | CanvasPattern;
  height?: number;
  radius: number;
  startAngle: number;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  width?: number;
  x?: number;
  y?: number;
};

export function Arc({
  children,
  fillStyle,
  fillRule,
  strokeStyle,
  radius,
  startAngle,
  endAngle,
  counterclockwise,
  x = 0,
  y = 0,
}: ArcProps) {
  const ctx = useContext2d();

  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
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
