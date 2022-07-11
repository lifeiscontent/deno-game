import { EventEmitter } from "./EventEmitter.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type GameTime = {
  frameId?: number;
  now: number;
  start: number;
  ticks: number;
  delta?: number;
  elapsed: number;
  lastCalled: number;
  stepDuration: number;
  lastRenderDelta: number;
};

export type GameLoopEventMap = {
  enter: (time: GameTime) => void;
  leave: (time: GameTime) => void;
  tick: (time: GameTime) => void;
  step: (time: GameTime) => void;
  render: (time: GameTime) => void;
};

export class GameLoop extends EventEmitter<GameLoopEventMap> {
  tickId?: number;
  isRunning = false;
  constructor(public room: string) {
    super();
  }

  start() {
    const getTime = () => performance.now();
    const start = getTime();
    let now = 0;
    let lastRender = start;

    const frameskipDeltaThreshold = 17;
    this.isRunning = true;

    const time: GameTime = {
      frameId: undefined,
      now: start,
      start: start,
      ticks: 0,
      delta: undefined,
      elapsed: 0,
      lastCalled: start,
      stepDuration: 0,
      lastRenderDelta: 0,
    };

    const tick = () => {
      time.ticks += 1;

      if (!this.isRunning) {
        if (typeof time.frameId === "number") {
          cancelAnimationFrame(time.frameId);
        }
        time.frameId = undefined;
        return;
      }

      this.emit("tick", time);

      // update time object with the new time and deltas
      now = getTime();

      time.now = now;
      time.delta = now - time.lastCalled;
      time.elapsed += time.delta;

      // perform a step
      this.emit("step", time);

      // after a step we measure the time it took to determine if too much processing
      // occurred for an immediate render, a la, frame sklpping
      now = getTime();
      time.stepDuration = now - time.now;
      time.lastRenderDelta = now - lastRender;

      if (time.stepDuration > frameskipDeltaThreshold) {
        // this.stats.skippedFrames += 1;
        time.elapsed -= time.delta;
        time.lastCalled = now;
      } else {
        lastRender = now;
        // this.events.emit('prerender', time, this.renderer, this);
        // this.events.emit('render', time, this.renderer, this);
        this.emit("render", time);
        time.lastCalled = now;
        // this.events.emit('postrender', time, this.renderer, this);
      }

      time.frameId = requestAnimationFrame(tick);
    };

    // we ride
    time.frameId = requestAnimationFrame(tick);
  }

  tick() {
    if (IS_BROWSER) {
      this.clientTick();
    } else {
      this.serverTick();
    }
  }

  private clientTick() {}
  private serverTick() {}

  step() {}

  render() {}
}
