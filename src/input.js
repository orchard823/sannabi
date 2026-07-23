import { GAME_HEIGHT, GAME_WIDTH } from "./constants.js";

export class InputController {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set();
    this.mouse = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, down: false, right: false, clicked: false };
    this.bind();
  }

  bind() {
    window.addEventListener("keydown", (event) => {
      if (!this.keys.has(event.code)) {
        this.pressed.add(event.code);
      }
      this.keys.add(event.code);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.code);
    });

    this.canvas.addEventListener("pointermove", (event) => {
      this.setPointer(event);
    });

    this.canvas.addEventListener("pointerdown", (event) => {
      this.canvas.focus();
      this.setPointer(event);
      if (event.button === 2) {
        this.mouse.right = true;
      } else {
        this.mouse.down = true;
        this.mouse.clicked = true;
      }
    });

    window.addEventListener("pointerup", (event) => {
      if (event.button === 2) {
        this.mouse.right = false;
      } else {
        this.mouse.down = false;
      }
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  setPointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    this.mouse.x = (event.clientX - rect.left) * scaleX;
    this.mouse.y = (event.clientY - rect.top) * scaleY;
  }

  isDown(...codes) {
    return codes.some((code) => this.keys.has(code));
  }

  consume(...codes) {
    const hit = codes.some((code) => this.pressed.has(code));
    for (const code of codes) {
      this.pressed.delete(code);
    }
    return hit;
  }

  endFrame() {
    this.pressed.clear();
    this.mouse.clicked = false;
  }
}
