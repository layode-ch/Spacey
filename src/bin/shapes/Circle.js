import { Shape } from "./Shape.js";
export class Circle extends Shape {
    radius;
    constructor(radius) {
        super();
        this.radius = radius;
    }
    clone() {
        return new Circle(this.radius);
    }
    draw(ctx, x = 0, y = 0) {
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        super.draw(ctx, x, y);
    }
}
