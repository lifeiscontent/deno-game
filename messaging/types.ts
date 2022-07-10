import type { Player } from "~/entities/index.ts";

interface Message<TType extends string> {
  type: TType;
  generation: number;
}

// Client Messages

interface AddPlayerClientMessage extends Message<"addPlayer"> {
  player: Player;
}

interface UpdatePlayerClientMessage extends Message<"updatePlayer"> {
  player: Player;
}

export type ClientMessage =
  | AddPlayerClientMessage
  | UpdatePlayerClientMessage;

// Server Messages

interface HandShakeServerMessage extends Message<"handshake"> {
  id: Player["id"];
}

interface AddPlayerServerMessage extends Message<"addPlayer"> {
  player: Player;
}

interface UpdatePlayerServerMessage extends Message<"updatePlayer"> {
  player: Player;
}

interface RemovePlayerServerMessage extends Message<"removePlayer"> {
  id: Player["id"];
}

export type ServerMessage =
  | HandShakeServerMessage
  | AddPlayerServerMessage
  | UpdatePlayerServerMessage
  | RemovePlayerServerMessage;
