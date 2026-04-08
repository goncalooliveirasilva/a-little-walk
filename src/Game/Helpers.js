import * as THREE from "three"
import Game from "./Game"

export default class Helpers {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug

    this.params = {
      gridSize: 100,
      cellSize: 1,
      axesLength: 5,
    }

    this.group = new THREE.Group()
    this.scene.add(this.group)

    this.setGrid()
    this.setAxes()
    this.setOriginMarker()
    this.setDebug()
  }

  setGrid() {
    if (this.grid) {
      this.group.remove(this.grid)
      this.grid.dispose()
    }

    const { gridSize, cellSize } = this.params

    // Main grid
    this.grid = new THREE.GridHelper(
      gridSize,
      gridSize / cellSize,
      0xaa2222,
      0x2a3a55,
    )
    this.group.add(this.grid)
  }

  setAxes() {
    if (this.axes) {
      this.group.remove(this.axes)
      this.axes.dispose()
    }

    this.axes = new THREE.AxesHelper(this.params.axesLength)
    this.group.add(this.axes)
  }

  setOriginMarker() {
    const ringGeo = new THREE.RingGeometry(0.3, 0.5, 32)
    ringGeo.rotateX(-Math.PI * 0.5)
    this.originMarker = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: 0x4466aa, side: THREE.DoubleSide }),
    )
    this.originMarker.position.y = 0.02
    this.group.add(this.originMarker)
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Helpers",
      expanded: false,
    })

    this.debugFolder.addBinding(this.group, "visible", { label: "All" })

    // Grid folder
    const gridFolder = this.debugFolder.addFolder({
      title: "Grid",
      expanded: false,
    })
    gridFolder.addBinding(this.grid, "visible", { label: "Main" })
    gridFolder
      .addBinding(this.params, "gridSize", {
        label: "Size",
        min: 5,
        max: 100,
        step: 5,
      })
      .on("change", () => this.setGrid())
    gridFolder
      .addBinding(this.params, "cellSize", {
        label: "Cell size",
        min: 1,
        max: 20,
        step: 1,
      })
      .on("change", () => this.setGrid())

    // Axes folder
    const axesFolder = this.debugFolder.addFolder({
      title: "Axes",
      expanded: false,
    })
    axesFolder.addBinding(this.axes, "visible", { label: "Visible" })
    axesFolder
      .addBinding(this.params, "axesLength", {
        label: "Length",
        min: 1,
        max: 50,
        step: 1,
      })
      .on("change", () => this.setAxes())

    // Origin marker
    this.debugFolder.addBinding(this.originMarker, "visible", {
      label: "Origin marker",
    })
  }
}
