import type { Input, Player } from "~/entities/index.ts";

// Client Messages

export type AddPlayerClientMessage = {
  type: "addPlayer";
  player: Omit<Player, "x" | "y" | "id">;
};

export type RemovePlayerClientMessage = {
  type: "removePlayer";
  id: Player["id"];
};

export type PlayerInputMessage = {
  type: "playerInput";
  input: Input;
};

export type ClientMessage =
  | AddPlayerClientMessage
  | RemovePlayerClientMessage
  | PlayerInputMessage;

// Server Messages

export type CreatePlayerServerMessage = {
  type: "loadGameState";
  state: {
    playerId: Player["id"];
    playerIds: Player["id"][];
    players: [Player["id"], Player][];
  };
  timestamp: number;
};

export type AddPlayerServerMessage = {
  type: "addPlayer";
  player: Player;
  timestamp: number;
};

export type RemovePlayerServerMessage = {
  type: "removePlayer";
  id: Player["id"];
  timestamp: number;
};

export type MovePlayerServerMessage = {
  type: "movePlayer";
  id: Player["id"];
  x: Player["x"];
  y: Player["y"];
  timestamp: number;
};

export type ServerMessage =
  | AddPlayerServerMessage
  | RemovePlayerServerMessage
  | MovePlayerServerMessage
  | CreatePlayerServerMessage;
