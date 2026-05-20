import Game from "./Game/Game"

if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
  document.body.classList.add("is-mobile")
}

const game = new Game(document.querySelector("canvas.webgl"))
