import { Shape } from "./Shape.js";
export class Rectangle extends Shape {
    height;
    width;
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    clone() {
        return new Rectangle(this.width, this.height);
    }
    draw(ctx, x = 0, y = 0) {
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.closePath();
        super.draw(ctx, x, y);
    }
}
