import * as THREE from "three"
import Game from "../Game"

export default class Fences {
  constructor(config = {}) {
    this.game = new Game()
    this.scene = this.game.scene
    this.resources = this.game.resources

    this.modelNames = config.models || [
      "fences01Model",
      "fences02Model",
      "fences03Model",
      "fences04Model",
      "fences05Model",
    ]
    this.positions = config.positions || []

    this.setFences()
  }

  setFences() {
    if (this.positions.length === 0) return

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

      geometry.computeBoundingBox()
      const yOffset = -geometry.boundingBox.min.y

      const mesh = new THREE.InstancedMesh(geometry, material, instances.length)
      mesh.castShadow = true

      const matrix = new THREE.Matrix4()
      for (let i = 0; i < instances.length; i++) {
        const pos = instances[i]
        const s = pos.scale ?? 1
        matrix.compose(
          new THREE.Vector3(pos.x, yOffset * s + (pos.y ?? 0), pos.z),
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, pos.rotation ?? 0, 0),
          ),
          new THREE.Vector3(s, s, s),
        )
        mesh.setMatrixAt(i, matrix)
      }

      this.scene.add(mesh)
    })
  }
}
