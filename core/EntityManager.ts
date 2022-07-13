import type { IEntity, IVector2D } from "./types.ts";

export class EntityManager {

  entities: Map<number, Map<IEntity["id"], IEntity>> = new Map();

  add(entity: IEntity, layer: number) {
    if (!this.entities.has(layer)) {
      this.entities.set(layer, new Map());
    }

    this.entities.get(layer)!.set(entity.id, entity);
  }

  remove(entityId: IEntity["id"], layer?: number) {
    if (typeof layer === "number") {
      const entities = this.entities.get(layer);
      if (entities === undefined) {
        throw new Error(`Layer does not exist. (layer="${layer}")`);
      }

      entities.delete(entityId);
    }
    else {
      for (const layer of this.entities.values()) {
        if (layer.has(entityId)) {
          layer.delete(entityId);
          break;
        }
      }
    }
  }

  getEntities() {
    return this.entities;
  }

}