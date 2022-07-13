import { EntityManager } from "./EntityManager.ts";
import type { GameLoop, GameTime } from "./GameLoop.ts";

export class GameStateManager {
  constructor(private gameloop: GameLoop) {}

  states = new Map<GameState["name"], GameState>();
  current?: GameState["name"];

  add(state: GameState) {
    this.states.set(state.name, state);
  }

  change(nextStateName: GameState["name"]) {
    const previous = this.states.get(this.current!);

    // shut down previous state
    if (previous) {
      this.unmount(previous);
      previous.leave();
    }

    const nextState = this.states.get(nextStateName);

    // switch to next state
    if (nextState) {
      this.current = nextStateName;
      this.mount(nextState);
      nextState.enter();
    } else {
      console.error(
        `No state found for ${nextStateName} going from ${this.current}`
      );
      this.current = undefined;
    }
  }

  mount(state: GameState) {
    if (state.tick) this.gameloop.on("tick", state.tick.bind(state));
    if (state.step) this.gameloop.on("tick", state.step.bind(state));
    if (state.render) this.gameloop.on("tick", state.render.bind(state));
  }

  unmount(state: GameState) {
    if (state.tick) this.gameloop.off("tick", state.tick.bind(state));
    if (state.step) this.gameloop.off("tick", state.step.bind(state));
    if (state.render) this.gameloop.off("tick", state.render.bind(state));
  }
}

export abstract class GameState {
  constructor(public name: string, public context: CanvasRenderingContext2D, protected entityManager: EntityManager) {}
  abstract enter(): void;
  abstract leave(): void;
  abstract step(time: GameTime): void;
  abstract render(time: GameTime): void;
  abstract tick(time: GameTime): void;
}
