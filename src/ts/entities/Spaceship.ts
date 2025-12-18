import { Collider } from "../physics/Collider.js";
import { Vector } from "../physics/Vector.js";
import { Circle } from "../shapes/Circle.js";
import { AnimationManager } from "../utilities/AnimationManager.js";
import { Sprite } from "../utilities/Sprite.js";
import { Entity } from "./Entity.js";

export class Spaceship extends Entity {
	animManager: AnimationManager;
	static img: HTMLImageElement|null = null;
	/**
	 * Creates an instance of Spaceship.
	 *
	 * @constructor
	 */
	constructor(x = 0, y = 0) {
		const shape = new Circle(50);
		super(new Collider(shape, x, y), new Sprite(64, 64))
		if (Spaceship.img == null) {
			Spaceship.img = new Image();
			Spaceship.img.src = "img/spaceship.png";
		}
		this.sprite.src = Spaceship.img;
		this.collider.velocity.y += this.speed;
	}
}