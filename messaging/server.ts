import type { ClientMessage, ServerMessage } from "./types.ts";
import { deserialize, serialize } from "bson";

export const deserializeMessage = deserialize as (
  buffer: ArrayBuffer,
) => ClientMessage;

export const serializeMessage = serialize as (
  message: ServerMessage,
) => ArrayBuffer;
