import type { ClientMessage, ServerMessage } from "./types.ts";
import { deserialize, serialize } from "bson";

export const deserializeMessage = deserialize as (
  buffer: ArrayBuffer,
) => ServerMessage;

export const serializeMessage = serialize as (
  message: ClientMessage,
) => ArrayBuffer;
