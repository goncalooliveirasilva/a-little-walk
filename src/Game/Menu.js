export default class Menu {
  constructor() {
    this.button = document.getElementById("menu-button")
    this.panel = document.getElementById("menu-panel")
    this.isOpen = false

    this.button.addEventListener("click", () => this.toggle())

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
