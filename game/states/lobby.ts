import { GameState, } from "~/core/GameState.ts"


export class LobbyState extends GameState {
  tick() {}
  step() {}
  render() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.fillText("Welcome to the lobby", 100, 100);
  }
  enter() {
    console.log("Joined the lobby");
  }
  leave() {
    console.log("Left the lobby");
  }
}