export interface IVector2D {
    x: number;
    y: number;
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IDrawable extends IRect {
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IEntity extends IRect {
    id: unknown;
    local: IVector2D;
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IEntityManager {
    getEntities(): IEntity[][];
}

