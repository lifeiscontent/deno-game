import type { Player } from "~/entities/index.ts";
import type { AddPlayerApiMessage } from "~/messages/index.ts";

class Database {
  #players: Player[] = [];
  #playerId = 0;
  addPlayer = (player: AddPlayerApiMessage["player"]) => {
    const newPlayer = {
      ...player,
      x: Math.ceil(Math.random() * 200),
      y: Math.ceil(Math.random() * 200),
      id: this.#playerId++,
    };
    this.#players.push(newPlayer);

    return newPlayer;
  };
  getPlayers = () => this.#players;
}

export const database = new Database();
