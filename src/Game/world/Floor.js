import * as THREE from "three"
import * as CANNON from "cannon-es"
import Game from "../Game"

const PLANE_SIZE = 500
const SEGMENTS = 512
const MAX_HEIGHT = 3
const LAKE_DEPTH_SCALE = 0.4

export const WATER_LEVEL = 2

export default class Floor {
  constructor() {
    this.game = new Game()
    this.scene = this.game.scene
    this.debug = this.game.debug
    this.physics = this.game.physics
    this.resources = this.game.resources

    this.color = "#046504"
    this.heights = null

    this.setGeometry()
    this.buildHeights()
    this.displaceVertices()
    this.setMaterial()
    this.setMesh()
    this.setBody()
    this.setDebug()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(
      PLANE_SIZE,
      PLANE_SIZE,
      SEGMENTS,
      SEGMENTS,
    )
  }

  buildHeights() {
    const image = this.resources.items.heightMap.image
    const size = SEGMENTS + 1

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)

    const worldSize = this.game.world.worldSize

    this.heights = []
    for (let row = 0; row <= SEGMENTS; row++) {
      for (let col = 0; col <= SEGMENTS; col++) {
        // World position of this vertex
        const worldX = -PLANE_SIZE / 2 + col * (PLANE_SIZE / SEGMENTS)
        const worldZ = -PLANE_SIZE / 2 + row * (PLANE_SIZE / SEGMENTS)

        // Same UV formula the grass shader uses for mapTexture
        const uvX = Math.max(0, Math.min(1, worldX / worldSize + 0.5))
        const uvZ = Math.max(0, Math.min(1, worldZ / worldSize + 0.5))

        const imgCol = Math.round(uvZ * (size - 1))
        const imgRow = Math.round((1 - uvX) * (size - 1))
        const px = (imgRow * size + imgCol) * 4

        if (col === 0) this.heights.push([])
        const h = (data[px] / 255 - 0.5) * 2 * MAX_HEIGHT
        this.heights[row].push(h < 0 ? h * LAKE_DEPTH_SCALE : h)
      }
    }

    // Anchor the center of the map to Y=0 so the fox spawn is always on the ground
    const centerHeight =
      this.heights[Math.floor(SEGMENTS / 2)][Math.floor(SEGMENTS / 2)]
    for (let row = 0; row <= SEGMENTS; row++) {
      for (let col = 0; col <= SEGMENTS; col++) {
        this.heights[row][col] -= centerHeight
      }
    }
  }

  displaceVertices() {
    const positions = this.geometry.attributes.position
    const size = SEGMENTS + 1

    for (let row = 0; row <= SEGMENTS; row++) {
      for (let col = 0; col <= SEGMENTS; col++) {
        positions.setZ(row * size + col, this.heights[row][col])
      }
    }

    positions.needsUpdate = true
    this.geometry.computeVertexNormals()
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: this.color,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }

  setBody() {
    const elementSize = PLANE_SIZE / SEGMENTS
    const size = SEGMENTS + 1

    const matrix = []
    for (let col = 0; col < size; col++) {
      matrix.push([])
      for (let row = 0; row < size; row++) {
        matrix[col].push(this.heights[row][col])
      }
    }

    const shape = new CANNON.Heightfield(matrix, { elementSize })
    this.body = new CANNON.Body({ type: CANNON.Body.STATIC })
    this.body.addShape(shape)
    this.body.position.set(-PLANE_SIZE / 2, 0, -PLANE_SIZE / 2)
    this.physics.world.addBody(this.body)
  }

  setDebug() {
    if (!this.debug.active) return

    this.debugParams = {
      color: this.color,
    }

    this.debugFolder = this.game.debugFolder.addFolder({
      title: "Floor",
      expanded: false,
    })

    this.debugFolder
      .addBinding(this.debugParams, "color", { label: "Color" })
      .on("change", (e) => {
        this.material.color.set(e.value)
      })
  }
}
