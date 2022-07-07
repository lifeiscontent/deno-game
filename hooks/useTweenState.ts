import { StateUpdater, useCallback, useRef, useState } from "preact/hooks";
export * from "./easings.ts";

type TweenStateConfig = {
  easing: (x: number) => number;
  duration: number;
};

export function useTweenState(
  from: number,
  { duration, easing }: TweenStateConfig,
) {
  const animationFrameHandle = useRef<number>();
  const startTime = useRef<number>();
  const startFrom = useRef<number>(from);
  const currentValue = useRef<number>(from);
  const [to, setTo] = useState<number>(from);
  const updateTo: StateUpdater<number> = useCallback((nextTo) => {
    startTime.current = performance.now();
    const evaluatedTo = nextTo instanceof Function
      ? nextTo(startFrom.current)
      : nextTo;
    const loop = () => {
      const elapsed = performance.now() - startTime.current!;
      const distance = evaluatedTo - startFrom.current;

      // distance traveled so far between start and target value
      const traveled = (distance / duration) * elapsed;

      // percentage traveled so far
      const percentage = (100 / distance) * traveled;

      // factor (between 0 - 1) traveled so far
      const factor = percentage / 100;

      // elapsed may be greater than duration which can happen if animationFrame/loop 'overshoots' duration time (it fires async after all)
      const isFinished = elapsed >= duration;

      const newEasedValue = isFinished
        ? evaluatedTo
        : startFrom.current + easing(factor) * distance;
      setTo(newEasedValue);
      currentValue.current = newEasedValue;

      if (isFinished) {
        startFrom.current = newEasedValue;
        cancelAnimationFrame(animationFrameHandle.current!);
      } else {
        animationFrameHandle.current = requestAnimationFrame(loop);
      }
    };
    startFrom.current = currentValue.current;
    animationFrameHandle.current = requestAnimationFrame(loop);
  }, []);

  return [to, updateTo] as const;
}
