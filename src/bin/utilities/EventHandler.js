export class EventHandler {
    #eventListeners = [];
    invoke(obj, args) {
        if (this.#eventListeners.length > 0) {
            for (const eventListener of this.#eventListeners) {
                eventListener(obj, args);
            }
        }
    }
    add(...items) {
        for (const eventListener of items) {
            this.#eventListeners.push(eventListener);
        }
    }
    remove(...items) {
        this.#eventListeners = this.#eventListeners.filter(listener => !items.includes(listener));
    }
    removeAt(index) {
        if (index >= 0 && index < this.#eventListeners.length) {
            this.#eventListeners.splice(index, 1);
        }
    }
    clear() {
        this.#eventListeners = [];
    }
    has(listener) {
        return this.#eventListeners.includes(listener);
    }
}
