/** @jsx h */
import { h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function JoinGame() {
  const handleSubmit: h.JSX.GenericEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const room = data.get("room");
      window.location.href = `/${room}`;
    },
    [],
  );

  return (
    <form onSubmit={handleSubmit}>
      <label>Room:</label>
      <input type="text" name="room" />
      <button type="submit">Join</button>
    </form>
  );
}
