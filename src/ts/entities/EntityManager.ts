import { Collider } from "../physics/Collider.js";
import { Entity } from "./Entity.js";

export class EntityManager extends Array<Entity> {

	constructor() {
		super();
	}

	remove(...items: Entity[]) {
		for (const entity of items) {
			const index = this.indexOf(entity); 
			if (index >= 0)
				this.splice(index, 1);
		}
	}

	getEntityByCollider(collider: Collider): Entity|null {
		const entity = this.find(e => e.collider == collider);
		if (entity === undefined)
			return null;
		return entity;
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.forEach(e => e.draw(ctx));
	}


}