import * as THREE from "three"
import Game from "../Game"

export default class Rocks {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.modelNames = config.models || [
      "rocks01Model",
      "rocks02Model",
      "rocks03Model",
      "rocks04Model",
    ]
    this.positions = config.positions || []

    this.setRocks()
  }

  setRocks() {
    if (this.positions.length === 0) return

    this.meshes = []

    this.modelNames.forEach((modelName, typeIndex) => {
      const model = this.resources.items[modelName].scene

      let geometry, material
      model.traverse((child) => {
        if (child.isMesh) {
          geometry = child.geometry
          material = child.material
        }
      })

      if (!geometry) return

      const instances = this.positions.filter((p) => p.type === typeIndex)
      if (instances.length === 0) return

      // Offset so the bottom of the model sits on the floor (y = 0)
      geometry.computeBoundingBox()
      const yOffset = -geometry.boundingBox.min.y

      const mesh = new THREE.InstancedMesh(geometry, material, instances.length)

      const matrix = new THREE.Matrix4()
      for (let i = 0; i < instances.length; i++) {
        const pos = instances[i]
        const s = pos.scale
        matrix.compose(
          new THREE.Vector3(pos.x, yOffset * s, pos.z),
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          ),
          new THREE.Vector3(s, s, s),
        )
        mesh.setMatrixAt(i, matrix)
      }

      this.scene.add(mesh)
      this.meshes.push(mesh)
    })
  }
}
