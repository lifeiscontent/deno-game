/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Canvas, Rect } from "~/components/index.ts";

interface GameProps {}

export default function Game(props: GameProps) {
  return (
    <Canvas>
      <Rect fillColor="red" x={0} y={0} />
    </Canvas>
  );
}
