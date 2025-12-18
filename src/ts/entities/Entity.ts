import { Collider } from "../physics/Collider.js";
import { Sprite } from "../utilities/Sprite.js";
import { EventHandler } from "../utilities/EventHandler.js";

export class Entity {
	collider: Collider;
	sprite: Sprite;
	speed: number;
	maxHp: number;
	#hp: number;
	hpChanged: EventHandler<Entity, {value: number}>;

	get hp() { return this.#hp; }
	set hp(value) {
		const oldValue = this.#hp;
		if (value > this.maxHp)
			this.#hp = this.maxHp;
		else if (value < 0)
			this.#hp = 0;
		else 
			this.#hp = value;
		this.hpChanged.invoke(this, {value: oldValue});
	}
	
	/**
	 * Creates an instance of Entity.
	 *
	 * @constructor
	 * @param {Collider} collider 
	 * @param {Sprite} [sprite=new Sprite()]
	 */
	constructor(collider: Collider, sprite: Sprite = new Sprite(), maxHp = 1, speed = 5) {
		this.collider = collider;
		this.sprite = sprite;
		this.speed = speed;
		this.maxHp = maxHp;
		this.#hp = maxHp;
		this.hpChanged = new EventHandler();
	}
	
	draw(ctx: CanvasRenderingContext2D) {
		if (this.sprite.src !== null)
			this.sprite.draw(ctx, this.collider.x, this.collider.y);
	}
}