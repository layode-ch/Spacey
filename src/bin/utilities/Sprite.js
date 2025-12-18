import { Vector } from "../physics/Vector.js";
export class Sprite {
    offset;
    src = null;
    tintColor;
    ration = 1;
    get height() {
        if (this.src instanceof VideoFrame)
            return this.src.codedHeight;
        else
            return Number(this.src.height);
    }
    get width() {
        if (this.src instanceof VideoFrame)
            return this.src.codedWidth;
        else
            return Number(this.src.width);
    }
    constructor(offestX = 0, offestY = 0) {
        this.offset = new Vector(offestX, offestY);
        this.tintColor = "rgba(0, 0, 0, 0)";
    }
    draw(ctx, x, y) {
        // Draw the sprite to the canvas
        //let image = this.#applyFilter()
        const X = x - this.offset.x;
        const Y = y - this.offset.y;
        ctx.drawImage(this.src, X, Y, this.width * this.ration, this.height * this.ration);
    }
}
