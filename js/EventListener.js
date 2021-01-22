class EventListener {
  static #KEY_ARROW_DOWN = 'ArrowDown';
  static #KEY_ARROW_LEFT = 'ArrowLeft';
  static #KEY_ARROW_RIGHT = 'ArrowRight';
  static #KEY_ARROW_UP = 'ArrowUp';

  #up;
  #down;
  #left;
  #right;

  constructor() {
    this.#up = false;
    this.#down = false;
    this.#left = false;
    this.#right = false;
    window.onkeydown = this.#onkeydown;
    window.onkeyup = this.#onkeyup;
  }

  #onkeydown(event) {
    switch (event.code) {
    case EventListener.#KEY_ARROW_UP:
      this.#up = true;
      break;
    case EventListener.#KEY_ARROW_DOWN:
      this.#down = true;
      break;
    case EventListener.#KEY_ARROW_LEFT:
      this.#left = true;
      break;
    case EventListener.#KEY_ARROW_RIGHT:
      this.#right = true;
    }
    if (this.#up && (!this.#down)) {
      console.log('Up');
    } else if (this.#down && (!this.#up)) {
      console.log('Down');
    } else if (this.#left && (!this.#right)) {
      console.log('Left');
    } else if (this.#right && (!this.#left)) {
      console.log('Right');
    }
  }

  #onkeyup(event) {
    switch (event.code) {
    case EventListener.#KEY_ARROW_UP:
      this.#up = false;
      break;
    case EventListener.#KEY_ARROW_DOWN:
      this.#down = false;
      break;
    case EventListener.#KEY_ARROW_LEFT:
      this.#left = false;
      break;
    case EventListener.#KEY_ARROW_RIGHT:
      this.#right = false;
    }
    if (this.#up && (!this.#down)) {
      console.log('Up');
    } else if (this.#down && (!this.#up)) {
      console.log('Down');
    } else if (this.#left && (!this.#right)) {
      console.log('Left');
    } else if (this.#right && (!this.#left)) {
      console.log('Right');
    }
  }
}
