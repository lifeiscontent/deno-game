import type { ChannelMessage } from "~/messages/index.ts";

export class RoomChannel {
  #channel: BroadcastChannel;

  constructor() {
    this.#channel = new BroadcastChannel("game");
  }

  onMessage(handler: (message: ChannelMessage) => void) {
    const listener = (e: MessageEvent) => handler(e.data);

    this.#channel.addEventListener("message", listener);
    return {
      unsubscribe: () => this.#channel.removeEventListener("message", listener),
    };
  }

  close() {
    this.#channel.close();
  }
  send(message: ChannelMessage) {
    this.#channel.postMessage(message);
  }

  //   sendText(message: Omit<RoomTextChannelMessage, "kind">) {
  //     this.#channel.postMessage({
  //       kind: "text",
  //       ...message,
  //     });
  //   }

  //   sendIsTyping(user: UserView) {
  //     const message: RoomIsTypingChannelMessage = {
  //       kind: "isTyping",
  //       from: user,
  //     };
  //     this.#channel.postMessage(message);
  //   }
}
