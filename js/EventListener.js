class EventListener {
  constructor() {
    window.onkeydown = this.#onkeydown;
    window.onkeyup = this.#onkeyup;
  }

  #onkeydown(event) {
    console.log(`Key Down: ${event}`);
  }

  #onkeyup(event) {
    console.log(`Key Up: ${event}`);
  }
}
