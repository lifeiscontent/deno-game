import type { Player } from "~/entities/index.ts";

export type AddPlayerApiMessage = {
  type: "addPlayer";
  player: Omit<Player, "x" | "y" | "id">;
};

export type ApiMessage = AddPlayerApiMessage;

export type AddPlayerChannelMessage = {
  type: "addPlayer";
  player: Player;
};

export type ChannelMessage = AddPlayerChannelMessage;
