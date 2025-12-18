import { Joystick } from "../components/index.js";
import { Collider, Vector, World } from "../physics/index.js";
import { Rectangle } from "../shapes/Rectangle.js";
import { Page } from "./Page.js";
import { Spaceship, Alien, EntityManager, Bullet } from "../entities/index.js";
export class Game extends Page {
    canvas;
    #ctx;
    #world;
    #joystick;
    #player;
    #entityManager = new EntityManager();
    #walls = new Map();
    constructor(template) {
        super(template);
    }
    async init() {
        this.canvas = this.main.querySelector("canvas");
        this.canvas.height = this.canvas.getBoundingClientRect().height - 40;
        this.canvas.width = window.innerWidth;
        this.#ctx = this.canvas.getContext("2d");
        this.#joystick = document.querySelector(`[is="${Joystick.name}"]`);
        this.#player = new Spaceship(0, 0);
        this.#entityManager.push(this.#player);
        this.#world = new World(Vector.ZERO, this.#player.collider);
        this.#createWalls();
        this.#createAlien();
        setInterval(this.#update.bind(this), 1000 / 60);
        setInterval(() => {
            this.#shoot();
        }, 1000);
    }
    #shoot() {
        const bullet = new Bullet(this.#player.collider.x, this.#player.collider.y);
        bullet.collider.collide.add((o, args) => {
            if (args.collider == this.#walls.get("top")) {
                this.#entityManager.remove(bullet);
                this.#world.remove(o);
                return;
            }
            const entity = this.#entityManager.getEntityByCollider(args.collider);
            if (entity instanceof Alien) {
                entity.hp -= 10;
                console.log(entity.hp);
                this.#entityManager.remove(bullet);
                this.#world.remove(o);
            }
        });
        this.#entityManager.push(bullet);
        this.#world.push(bullet.collider);
    }
    #createAlien() {
        const alien = new Alien(100, 100);
        alien.collider.shape.color = "blue";
        alien.collider.collide.add(this.#alienOncollide.bind(this));
        this.#entityManager.push(alien);
        this.#world.push(alien.collider);
    }
    #alienOncollide(sender, args) {
        if (this.#walls.get("bottom") == args.collider) {
            const entity = this.#entityManager.getEntityByCollider(sender);
            this.#entityManager.remove(entity);
            this.#world.remove(sender);
        }
    }
    #createWalls() {
        const shape = new Rectangle(this.canvas.width, this.canvas.height);
        shape.color = "green";
        const left = new Collider(shape.clone(), shape.width, 0, Vector.ZERO, "static");
        const right = new Collider(shape.clone(), -shape.width, 0, Vector.ZERO, "static");
        const bottom = new Collider(shape.clone(), 0, shape.height, Vector.ZERO, "static");
        const top = new Collider(shape.clone(), 0, -shape.height, Vector.ZERO, "transparent");
        this.#walls.set("left", left);
        this.#walls.set("right", right);
        this.#walls.set("bottom", bottom);
        this.#walls.set("top", top);
        this.#world.push(left, right, bottom, top);
    }
    #update() {
        this.#player.collider.velocity = this.#joystick.vector.divided(5);
        this.#world.update();
        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#world.draw(this.#ctx);
        this.#entityManager.draw(this.#ctx);
    }
}
