import { Collider, Vector } from "../physics/index.js";
import { Circle } from "../shapes/Circle.js";
import { Rectangle } from "../shapes/Rectangle.js";
import { AnimationManager } from "../utilities/AnimationManager.js";
import { Sprite } from "../utilities/Sprite.js";
import { Entity } from "./Entity.js";

export class Bullet extends Entity {
	static img: HTMLImageElement|null = null;
	constructor(x: number, y: number) {
		const shape = new Rectangle(20, 32 * 2);
		super(new Collider(shape, x, y, Vector.ZERO, "transparent"), new Sprite(23, 0), 10, 10);
		this.sprite.ration = 2;
		if (Bullet.img == null) {
			Bullet.img = new Image();
			Bullet.img.src = "img/bullet.png";
		}
		this.sprite.src = Bullet.img;
		this.collider.velocity.y -= this.speed;
	}
}