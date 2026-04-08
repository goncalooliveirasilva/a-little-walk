import { gsap } from "gsap"

export default class Overlay {
  constructor() {
    this.element = document.getElementById("overlay")
    this.title = document.getElementById("overlay-title")
    this.letters = this.title.querySelectorAll("span")
    this.controls = document.getElementById("overlay-controls")

    this.element.addEventListener("click", () => this.start(), { once: true })
  }

  setProgress(progress) {
    const litCount = Math.floor(progress * this.letters.length)
    for (let i = 0; i < this.letters.length; i++) {
      if (i < litCount) {
        this.letters[i].classList.add("lit")
      }
    }
  }

  onReady() {
    // Light up all remaining letters
    this.letters.forEach((letter) => letter.classList.add("lit"))

    // Show controls
    gsap.to(this.controls, {
      opacity: 1,
      duration: 1,
      delay: 0.5,
      onStart: () => {
        this.controls.style.visibility = "visible"
      },
    })
  }

  start() {
    gsap.to(this.element, {
      opacity: 0,
      duration: 1.5,
      onComplete: () => {
        this.element.remove()
      },
    })
  }
}
