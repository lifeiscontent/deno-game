/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import Stage from "../islands/Stage.tsx";

export default function Home() {
  return (
    <>
      <style>{`body { margin: 0;}`}</style>
      <Stage />
    </>
  );
}
