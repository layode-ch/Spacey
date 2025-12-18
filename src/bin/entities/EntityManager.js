export class EntityManager extends Array {
    constructor() {
        super();
    }
    remove(...items) {
        for (const entity of items) {
            const index = this.indexOf(entity);
            if (index >= 0)
                this.splice(index, 1);
        }
    }
    getEntityByCollider(collider) {
        const entity = this.find(e => e.collider == collider);
        if (entity === undefined)
            return null;
        return entity;
    }
    draw(ctx) {
        this.forEach(e => e.draw(ctx));
    }
}
