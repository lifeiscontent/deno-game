import { useContext2d } from "./Canvas.tsx";
import { useEffect } from "preact/hooks";

export function Rect({
  fillColor,
  x,
  y,
}: {
  fillColor: string;
  x: number;
  y: number;
}) {
  const context2d = useContext2d();
  useEffect(() => {
    console.log("Rect", x, y, fillColor);
    context2d.fillStyle = fillColor;
    context2d.fillRect(x, y, context2d.canvas.width, context2d.canvas.height);
  }, [context2d, fillColor, x, y]);

  return null;
}
