/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import Game from "../islands/Game.tsx";
import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";

type Data = { room: string };

export const handler: Handler<Data> = async (
  req: Request,
  ctx: HandlerContext<Data>,
): Promise<Response> => {
  return await ctx.render({
    room: ctx.params.room,
  });
};

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <style>{`body { margin: 0;}`}</style>
      <Game room={props.data.room} />
    </>
  );
}
