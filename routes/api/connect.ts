import { Handlers } from "$fresh/server.ts";
import { RoomChannel } from "~/communication/RoomChannel.ts";

export const handler: Handlers = {
  GET(_req) {
    const channel = new RoomChannel();

    const stream = new ReadableStream({
      start: (controller) => {
        channel.onMessage((message) => {
          const body = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(body);
        });
      },
      cancel() {
        channel.close();
      },
    });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: { "content-type": "text/event-stream" },
    });
  },
};
