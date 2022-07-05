/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Canvas, Rect } from "~/components/index.ts";

type GameProps = unknown;

export default function Game(props: GameProps) {
  return (
    <Canvas>
      <Rect fillColor="red">
        <Rect fillColor="blue" x={200} y={200} />
      </Rect>
    </Canvas>
  );
}
