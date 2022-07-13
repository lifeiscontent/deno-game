import { IEntity, IVector2D } from "~/core/types.ts";

export class Entity implements IEntity {
  local: IVector2D = { x: -Infinity, y: -Infinity };

  constructor(
    public id: IEntity["id"],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {
  }

  update(): void {
    
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { width: w, height: h } = this;
    const {x, y} = this.local;
    ctx.fillStyle = "#f0f";
    ctx.rect(x, y, w, h);
    ctx.fill();
  }
}
