import { Alert } from "./Alert.js";
import { animate } from 'animejs';
export class Toast extends HTMLDivElement {
    animation;
    static get name() { return "toast-component"; }
    get delay() { return Number(this.getAttribute("delay")); }
    set delay(value) {
        this.setAttribute("delay", value.toString());
        if (value > 0) {
            setInterval(() => {
                this.#progress.value += 1;
                if (this.#progress.value >= this.#progress.max)
                    this.#alert.btnClose.click();
            }, value / 100);
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set type(value) {
        this.querySelector("progress").classList.toggle(`progress-${value}`, value !== null);
        this.setAttribute("type", value);
        this.#alert.type = value;
    }
    get message() { return this.#alert.message; }
    set message(value) { this.#alert.message = value; }
    #alert;
    #progress;
    constructor() {
        super();
        this.classList.add("w-lg");
        const type = this.type;
        const alert = Alert.create(this.textContent, type, true);
        alert.btnClose.addEventListener("click", () => {
            this.animation.onComplete = () => {
                this.remove();
            };
            this.animation.reverse();
        });
        const progress = document.createElement("progress");
        progress.classList.add("progress");
        progress.value = 0;
        progress.max = 100;
        this.#alert = alert;
        this.#progress = progress;
        this.innerHTML = "";
        this.append(alert, progress);
        this.type = type;
        this.delay = this.delay;
    }
    connectedCallback() {
        this.animation = animate(this, {
            opacity: { from: 0,
                duration: 300 }
        });
        // 	waapi.animate(this, {
        // 		opacity: { from: 0, 
        // 		duration: 300},
        // 		x: {
        // 			from: "3rem",
        // 			to: "0"
        // 		},
        // 		ease: spring({ stiffness: 100 }),
        // 	});
    }
    /**
     * Description placeholder
     */
    static create(message, type, delay) {
        const toast = document.createElement("div", { is: this.name });
        toast.message = message;
        toast.type = type;
        toast.delay = delay;
        return toast;
    }
}
customElements.define(Toast.name, Toast, { extends: "div" });
