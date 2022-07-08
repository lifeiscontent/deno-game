export type Id = unknown;

export type Player = {
  color: string;
  name: string;
  id: Id;
  x: number;
  y: number;
};

export type Input = "up" | "down" | "left" | "right";
