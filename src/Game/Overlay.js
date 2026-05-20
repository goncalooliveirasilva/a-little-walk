import { gsap } from "gsap"
import Game from "./Game"

const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0

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
      return
    }

    this.wind = { strength: 1 }
    this.scheduleGust()

    this.startLeaves()
  }

  // Shared gust system

  scheduleGust() {
    this.gustTimer = setTimeout(
      () => {
        const strength = 1.8 + Math.random() * 1.4
        const hold = 1500 + Math.random() * 2000
        gsap.to(this.wind, { strength, duration: 0.6, ease: "power2.in" })
        setTimeout(() => {
          gsap.to(this.wind, {
            strength: 1,
            duration: 2.5,
            ease: "power2.out",
            onComplete: () => this.scheduleGust(),
          })
        }, hold)
      },
      4000 + Math.random() * 7000,
    )
  }

  stopGust() {
    clearTimeout(this.gustTimer)
    gsap.killTweensOf(this.wind)
  }

  // Wind Leaves

  startLeaves() {
    this.leafInterval = setInterval(() => this.spawnLeaf(), 300)
  }

  spawnLeaf() {
    const size = 8 + Math.random() * 10
    const s = this.wind.strength
    const fromTop = Math.random() < 0.6

    // Wrapper travels the diagonal path
    const wrapper = document.createElement("div")
    wrapper.style.cssText = `
      position: absolute;
      pointer-events: none;
      left: ${fromTop ? Math.random() * 55 + "%" : "-15px"};
      top: ${fromTop ? "-15px" : Math.random() * 40 + "%"};
    `

    // Leaf is the visible shape inside the wrapper
    const leaf = document.createElement("div")
    leaf.style.cssText = `
      width: ${size}px;
      height: ${size * 0.65}px;
      background: rgba(255,255,255,${0.4 + Math.random() * 0.4});
      border-radius: 0 60% 0 60%;
    `
    wrapper.appendChild(leaf)
    this.element.appendChild(wrapper)

    const duration = (12 + Math.random() * 8) / s

    // Wrapper moves diagonally top-left to bottom-right
    gsap.to(wrapper, {
      x: window.innerWidth + 60,
      y: window.innerHeight * (0.5 + Math.random() * 0.45),
      duration,
      ease: "none",
      onComplete: () => {
        gsap.killTweensOf(leaf)
        wrapper.remove()
      },
    })

    // Leaf wobbles within the wrapper
    const wobble = () => {
      gsap.to(leaf, {
        x: `+=${(Math.random() - 0.5) * 70 * s}`,
        y: `+=${(Math.random() - 0.5) * 70 * s}`,
        duration: (1.5 + Math.random() * 2) / s,
        ease: "sine.inOut",
        onComplete: wobble,
      })
    }
    wobble()

    gsap.to(leaf, {
      rotation: Math.random() > 0.5 ? 360 : -360,
      duration: (2.5 + Math.random() * 2.5) / s,
      ease: "none",
      repeat: -1,
    })
  }

  stopLeaves() {
    clearInterval(this.leafInterval)
    this.leafInterval = null
  }

  // Lifecycle

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

        const startHandler = () => {
          this.element.removeEventListener("click", startHandler)
          this.element.removeEventListener("touchend", startHandler)
          this.start()
        }
        this.element.addEventListener("click", startHandler)
        this.element.addEventListener("touchend", startHandler)
      },
    })
  }

  start() {
    this.stopGust()
    this.stopLeaves()

    if (!isMobile) {
      const canvas = document.querySelector(".webgl")
      if (canvas) {
        try {
          const result = canvas.requestPointerLock()
          if (result && typeof result.catch === "function") {
            result.catch(() => {})
          }
        } catch (e) {}
      }
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
