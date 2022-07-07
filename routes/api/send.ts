import { HandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { RoomChannel } from "~/communication/RoomChannel.ts";
import { ApiMessage } from "~/messages/index.ts";
import { database } from "~/communication/database.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  //   const accessToken = getCookies(req.headers)["deploy_chat_token"];
  //   if (!accessToken) {
  //     return new Response("Not signed in", { status: 401 });
  //   }
  const message: ApiMessage = await req.json();
  const channel = new RoomChannel();

  switch (message.type) {
    case "addPlayer": {
      const player = database.addPlayer(message.player);
      channel.send({ type: "addPlayer", player });
      channel.close();
      return new Response("OK", { status: 200 });
    }
  }
}
