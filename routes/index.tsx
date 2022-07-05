/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";
import Game from "../islands/Game.tsx";

export default function Home() {
  return (
    <>
      <style>{`body { margin: 0;}`}</style>
      <Game />
    </>
  );
}
