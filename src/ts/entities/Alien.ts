import { Collider, Vector } from "../physics/index.js";
import { Circle } from "../shapes/Circle.js";
import { AnimationManager } from "../utilities/AnimationManager.js";
import { Sprite } from "../utilities/Sprite.js";
import { Timer } from "../utilities/Timer.js";
import { Entity } from "./Entity.js";

export class Alien extends Entity {
	animManager: AnimationManager;
	constructor(x: number, y: number) {
		const shape = new Circle(30);
		super(new Collider(shape, x, y, Vector.ZERO, "transparent"), new Sprite(30, 30), 10, 3);
		this.animManager = new AnimationManager("img/alien.png", 4, 1);
		this.animManager.createAnimation("idle", 4, 0, 3, true);
		this.animManager.play("idle");
		this.animManager.frameChange.add(o => {
			this.sprite.src = o.sprite!
		});
		this.collider.velocity.y += this.speed;
		this.hpChanged.add(this.#onhpChange.bind(this));
	}

	#onhpChange() {
		this.collider.velocity = Vector.ZERO;
		setTimeout(() => this.collider.velocity.y += this.speed, 200);
	}
}