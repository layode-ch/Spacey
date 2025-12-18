import { Vector } from "../physics/Vector.js";
export class Joystick extends HTMLDivElement {
    static get name() { return "joystick-component"; }
    button;
    vector;
    #max;
    constructor() {
        super();
        this.classList.add("border", "h-30", "w-30", "flex", "rounded-full");
        this.innerHTML = `
			<button class="btn btn-primary m-auto relative h-10 rounded-full w-10 rounded"></button>
		`;
        this.button = this.querySelector("button");
        this.addEventListener("touchstart", this.#ontouchstart.bind(this));
        this.addEventListener("touchmove", this.#ontouchmove.bind(this));
        this.addEventListener("touchend", this.#ontouchend.bind(this));
        this.vector = new Vector(0, 0);
        this.#max = 60;
    }
    #ontouchstart(e) {
        this.#setVector(e.touches[0]);
        this.#moveButton();
    }
    #ontouchmove(e) {
        this.#setVector(e.touches[0]);
        this.#moveButton();
    }
    #ontouchend() {
        this.vector.x = 0;
        this.vector.y = 0;
        this.#moveButton();
    }
    #setVector(touch) {
        const elementX = this.getBoundingClientRect().x;
        const elementWidth = this.getBoundingClientRect().width;
        const elementHeight = this.getBoundingClientRect().height;
        const elementY = this.getBoundingClientRect().y;
        this.vector.x = touch.pageX - elementX - elementWidth / 2;
        this.vector.y = touch.pageY - elementY - elementHeight / 2;
        this.#clampMagnitude();
    }
    #clampMagnitude() {
        if (this.vector.magnitude() ** 2 > this.#max ** 2) {
            this.vector.normalize();
            this.vector.multiply(this.#max);
        }
    }
    #moveButton() {
        this.button.style.left = `${this.vector.x}px`;
        this.button.style.top = `${this.vector.y}px`;
    }
}
customElements.define(Joystick.name, Joystick, { extends: "div" });
