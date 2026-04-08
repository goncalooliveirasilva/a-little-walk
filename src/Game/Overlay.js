import { gsap } from "gsap"

export default class Overlay {
  constructor() {
    this.element = document.getElementById("overlay")
    this.title = document.getElementById("overlay-title")
    this.percent = document.getElementById("overlay-percent")
    this.controls = document.getElementById("overlay-controls")
  }

  setProgress(progress) {
    this.percent.textContent = `${Math.round(progress * 100)}%`
  }

  onReady() {
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

        this.element.addEventListener("click", () => this.start(), {
          once: true,
        })
      },
    })
  }

  start() {
    gsap.to([this.title, this.controls], {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        gsap.to(this.element, {
          opacity: 0,
          duration: 2,
          onComplete: () => {
            this.element.remove()
          },
        })
      },
    })
  }
}
