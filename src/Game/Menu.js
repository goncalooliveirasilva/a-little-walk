export default class Menu {
  constructor() {
    this.button = document.getElementById("menu-button")
    this.panel = document.getElementById("menu-panel")
    this.isOpen = false

    this.button.addEventListener("click", () => this.toggle())
    this.setSoundControls()

    // Close with Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close()
      }
    })

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isOpen &&
        !this.panel.contains(e.target) &&
        !this.button.contains(e.target)
      ) {
        this.close()
      }
    })
  }

  setSoundControls() {
    for (const channel of ["ambience", "bees", "birds"]) {
      const toggle = document.getElementById(`sound-toggle-${channel}`)
      const slider = document.getElementById(`sound-volume-${channel}`)

      toggle.addEventListener("click", () => {
        const ch = window.game.soundManager.channels[channel]
        ch.enabled = !ch.enabled
        toggle.textContent = ch.enabled ? "On" : "Off"
        toggle.classList.toggle("off", !ch.enabled)
      })

      slider.addEventListener("input", () => {
        window.game.soundManager.channels[channel].volume = slider.value / 100
      })
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.isOpen = true
    this.button.classList.add("open")
    this.panel.classList.add("open")

    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
  }

  close() {
    this.isOpen = false
    this.button.classList.remove("open")
    this.panel.classList.remove("open")
  }
}
