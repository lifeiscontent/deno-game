/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";
import JoinGame from "../islands/JoinGame.tsx";

export default function Home() {
  return (
    <>
          <style>{`body { margin: 0;}`}</style>
          <JoinGame />
    </>
  );
}
