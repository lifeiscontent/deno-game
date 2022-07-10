import { createContext, Fragment, h } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";

type InputMap = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

const InputContext = createContext<InputMap>();

export function useInput() {
}
