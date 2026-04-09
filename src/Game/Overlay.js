import { gsap } from "gsap"
import Game from "./Game"

export default class Overlay {
  constructor() {
    this.game = new Game()
    this.debug = this.game.debug

    this.element = document.getElementById("overlay")
    this.title = document.getElementById("overlay-title")
    this.percent = document.getElementById("overlay-percent")
    this.controls = document.getElementById("overlay-controls")
    this.credits = document.getElementById("overlay-credits")

    if (this.debug.active) {
      this.element.remove()
    }
  }

  setProgress(progress) {
    if (this.debug.active) return
    this.percent.textContent = `${Math.round(progress * 100)}%`
  }

  onReady() {
    if (this.debug.active) return
    this.percent.textContent = "100%"

    gsap.to(this.percent, {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      onComplete: () => {
        this.percent.remove()

        gsap.to(this.title, { opacity: 1, duration: 1 })

        gsap.to(this.controls, {
          opacity: 1,
          duration: 1,
          delay: 1.5,
          onStart: () => {
            this.controls.style.visibility = "visible"
          },
        })

        gsap.to(this.credits, {
          opacity: 1,
          duration: 1,
          delay: 2,
          onStart: () => {
            this.credits.style.visibility = "visible"
          },
        })

        this.element.addEventListener("click", () => this.start(), {
          once: true,
        })
      },
    })
  }

  start() {
    const canvas = document.querySelector(".webgl")
    if (canvas) {
      canvas.requestPointerLock().catch(() => {})
    }

    gsap.to([this.title, this.controls, this.credits], {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        gsap.to(this.element, {
          opacity: 0,
          duration: 2,
          delay: 1.5,
          onComplete: () => {
            this.element.remove()
          },
        })
      },
    })
  }
}
