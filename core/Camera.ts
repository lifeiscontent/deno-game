import { IDrawable, IEntityManager, IRect, IVector2D } from "./types.ts";
import type { EntityManager } from "./EntityManager.ts"

function isIntersecting(boxA: IRect, boxB: IRect) {
  const rightBoundaryA = boxA.x + boxA.width;
  const leftBoundaryA = boxA.x;
  const topBoundaryA = boxA.y + boxA.height;
  const bottomBoundaryA = boxA.y;

  // horizontally intersecting
  const intersectingX = boxB.x <= leftBoundaryA && boxB.x >= rightBoundaryA;
  const intersectingY = boxB.y <= topBoundaryA && boxB.y >= bottomBoundaryA;

  return intersectingX && intersectingY;
}


export default class Camera implements IDrawable {
  x: number = 0;
  y: number = 0;

  constructor(private entityManager: EntityManager, public width: number, public height: number) {

  }

  // convert an object's X and Y into local space (aka, relative to the camera)
  private translate(thing: IRect): IVector2D {
    const { x, y, width, height } = this;
    return {
      x: x - thing.x,
      y: y - thing.y,
    };
  }

  step() { }

  update() {
    const layers = this.entityManager.getEntities();
    for (const layer of layers.values()) {
      for (const entity of layer.values()) {
        // const isInCamera = isIntersecting(this, entity);
  
        const { x, y} = this.translate(entity);
        entity.local.x = x;
        entity.local.y = y;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const layers = this.entityManager.getEntities();
    for (const layer of layers.values()) {
      for (const entity of layer.values()) {
        const isInCamera = isIntersecting(this, entity);
        if (isInCamera) {
          entity.draw(ctx);
        }
      }
    }
  }

  pan() { }

}