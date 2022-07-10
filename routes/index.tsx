/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import Game from "../islands/Game.tsx";

export default function Home() {
  return (
    <>
      <style>{`body { margin: 0; overflow: hidden; }`}</style>
      <Game />
    </>
  );
}
