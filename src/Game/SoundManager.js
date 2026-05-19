export default class SoundManager {
  constructor() {
    this.channels = {
      ambience: { enabled: true, volume: 1.0 },
      bees: { enabled: true, volume: 1.0 },
      birds: { enabled: true, volume: 1.0 },
    }
  }

  getMultiplier(channel) {
    const ch = this.channels[channel]
    return ch.enabled ? ch.volume : 0
  }
}
