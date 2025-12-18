import { Joystick } from "./components/Joystick.js";
import { Collider, Vector, World } from "./physics/index.js";
import { Rectangle } from "./shapes/Rectangle.js";
import { Spaceship, Alien, EntityManager, Bullet } from "./entities/index.js";
import { Timer } from "./utilities/Timer.js";
import { AnimationManager } from "./utilities/AnimationManager.js";
export class Game {
    canvas;
    #main;
    #ctx;
    #world;
    #joystick;
    #player;
    #entityManager = new EntityManager();
    #walls = new Map();
    #bulletSample;
    #context = new AudioContext();
    #timerBullet = new Timer(500);
    #timerAllien = new Timer(1000);
    #score = 0;
    #scoreElement;
    #timeElement;
    #time = 110;
    get score() { return this.#score; }
    set score(value) {
        this.#scoreElement.textContent = `Score: ${value}`;
        this.#score = value;
    }
    get time() { return this.#time; }
    set time(value) {
        this.#timeElement.textContent = `Seconds left: ${this.#time}`;
        this.#time = value;
    }
    constructor(main) {
        this.#main = document.querySelector(main);
        this.start();
    }
    async start() {
        this.#bulletSample = await this.#loadSample("audio/Shoot.mp3");
        this.canvas = this.#main.querySelector("canvas");
        this.#scoreElement = this.#main.querySelector("#score");
        this.#timeElement = this.#main.querySelector("#time");
        this.canvas.height = this.canvas.getBoundingClientRect().height - 40;
        this.canvas.width = window.innerWidth;
        this.#ctx = this.canvas.getContext("2d");
        this.#joystick = document.querySelector(`[is="${Joystick.name}"]`);
        this.#player = new Spaceship(this.#joystick.getBoundingClientRect().left, this.#joystick.getBoundingClientRect().top);
        this.#entityManager.push(this.#player);
        this.#world = new World(Vector.ZERO, this.#player.collider);
        this.#createWalls();
        this.#timerAllien.tick.add(this.#createAlien.bind(this));
        this.#timerBullet.tick.add(this.#shoot.bind(this));
        this.#timerBullet.start();
        this.#timerAllien.start();
        setInterval(this.#update.bind(this), 1000 / 60);
        const id = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
                clearInterval(id);
                alert(`Bravo! Vous avez fait un score de ${this.score}`);
                window.location.reload();
            }
        }, 1000);
    }
    async #loadSample(url) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return this.#context.decodeAudioData(buffer);
    }
    #playSample(sample, rate) {
        const source = this.#context.createBufferSource();
        source.buffer = sample;
        source.playbackRate.value = rate;
        source.connect(this.#context.destination);
        source.start(0);
    }
    #shoot() {
        this.#playSample(this.#bulletSample, this.#random(0.8, 1.4, 10));
        const bullet = new Bullet(this.#player.collider.x, this.#player.collider.y);
        bullet.collider.x -= 10;
        bullet.collider.y -= 10;
        bullet.collider.collide.add(this.#bulletOncollide.bind(this));
        this.#entityManager.push(bullet);
        this.#world.push(bullet.collider);
    }
    #createAlien() {
        const position = new Vector(this.#random(0, this.canvas.width - 30));
        const alien = new Alien(position.x, position.y);
        alien.collider.shape.color = "blue";
        alien.collider.collide.add(this.#alienOncollide.bind(this));
        alien.hpChanged.add(this.#alienOnhpchanged.bind(this));
        this.#entityManager.push(alien);
        this.#world.push(alien.collider);
    }
    #random(min, max, precision = 1) {
        return Math.floor(((Math.random() * (max - min)) + min) * precision) / precision;
    }
    #alienOncollide(sender, args) {
        if (this.#walls.get("bottom") == args.collider) {
            const entity = this.#entityManager.getEntityByCollider(sender);
            this.#entityManager.remove(entity);
            this.#world.remove(sender);
            return;
        }
    }
    #alienOnhpchanged(sender) {
        const alien = sender;
        if (sender.hp <= 0) {
            this.score += 1;
            this.#world.remove(alien.collider);
            const animManager = new AnimationManager("img/explosion.png", 4, 3);
            animManager.createAnimation("idle", 10, 0, 8);
            alien.animManager.stop();
            alien.sprite.ration = 0.2;
            alien.sprite.offset.x += 25;
            animManager.frameChange.add((o) => {
                alien.sprite.src = o.sprite;
            });
            animManager.end.add(() => {
                this.#entityManager.remove(alien);
            });
            animManager.play("idle");
        }
    }
    #bulletOncollide(sender, args) {
        const bullet = this.#entityManager.getEntityByCollider(sender);
        if (bullet === null)
            return;
        if (args.collider == this.#walls.get("top")) {
            this.#entityManager.remove(bullet);
            this.#world.remove(sender);
            return;
        }
        const entity = this.#entityManager.getEntityByCollider(args.collider);
        if (entity instanceof Alien) {
            entity.hp -= 5;
            this.#entityManager.remove(bullet);
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
        this.#entityManager.draw(this.#ctx);
    }
}
