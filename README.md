# A Little Walk

A simple, low-poly 3D exploration game built with [Three.js](https://threejs.org/) as the final project for the Introduction to Computer Graphics course at the University of Aveiro (2026).

**Play it here:** [a-little-walk.vercel.app](https://a-little-walk.vercel.app/)

> **Note:** This project is a work in progress.

## About

_A Little Walk_ is a peaceful exploration game where you control a small animal wandering through a handcrafted world.  
The focus is on relaxation, discovery, and atmosphere rather than challenge.

The goal is to craft a beautiful environment with an expressive cartoon aesthetic, eventually populated with trees, bushes, flowers, water, ruins, and ambient creatures like butterflies and bees, all lit by a dynamic day/night cycle.

See the [development log](./docs/DEVELOPMENT.md) for screenshots of the project's progress over time.

## Controls

| Key / Input     | Action          |
| --------------- | --------------- |
| `W` `A` `S` `D` | Move            |
| `Shift`         | Run             |
| `Mouse`         | Camera rotation |
| `Scroll`        | Camera zoom     |
| `Esc`           | Release mouse   |

Click anywhere on the scene to capture the mouse again.

## Getting Started

### Prerequisites

- Node.js

### Install & Run

```bash
# Clone the repo
git clone git@github.com:goncalooliveirasilva/a-little-walk.git
cd a-little-walk/

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).

### Debug Mode

Append `#debug` to the URL to enable the debug UI:

```
http://localhost:5173/#debug
```

This shows [Tweakpane](https://tweakpane.github.io/docs/) controls for every system (grass, fog, trees, etc.) and FPS stats.

## Tech Stack

- [Three.js](https://threejs.org/) (3D graphics)
- [cannon-es](https://github.com/pmndrs/cannon-es) (physics)
- [Blender](https://www.blender.org/) (3D modeling)
- [Tweakpane](https://tweakpane.github.io/docs/) (debug UI)
- [stats.js](https://github.com/mrdoob/stats.js) (performance stats)
- [GSAP](https://gsap.com/) (animations)
- [Vite](https://vite.dev/) (dev server and bundler)

## Inspiration

The following games served as the main sources of inspiration for this project: [_A Short Hike_](https://ashorthike.com/), for its peaceful world and unhurried pace; [_Firewatch_](https://www.firewatchgame.com/), for the visual approach, particularly forests, atmospheric lighting, and environmental mood; [_Alba: A Wildlife Adventure_](https://ustwogames.co.uk/games/alba-a-wildlife-adventure), for the idea of interacting with nature and wildlife in a gentle way; [_The First Tree_](https://www.thefirsttree.com/), for its emotional tone and low-poly forest aesthetic; and finally, [_ABZÛ_](https://abzugame.com/) as a reference for exploration-driven gameplay and strong, cohesive art direction.

## Credits

Created by [Gonçalo Silva](https://github.com/goncalooliveirasilva).

**Assets:**

- Fox model by [PixelMannen](https://opengameart.org/content/fox-and-shiba) (CC0)
- Fox animations by [tomkranis](https://sketchfab.com/3d-models/low-poly-fox-by-pixelmannen-animated-371dea88d7e04a76af5763f2a36866bc) (CC BY 4.0)
- glTF conversion by the [Khronos Group](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Fox)

## Use of AI

The overall project architecture (class-based structure, separation between `Game`, `World`, `Renderer`, `Physics`, etc., and the individual world entities) was designed and set up by me, based on patterns I learned from prior Three.js work.

During development I used [Claude](https://www.anthropic.com/claude) (Anthropic) as an assistant for tasks such as:

- Discussing implementation approaches and trade-offs (e.g., switching tree trunks to `InstancedMesh` for performance, implementation of the grass density map, structuring the loading screen).
- Generating boilerplate and helping iterate on shaders, some GSAP animations, and CSS for the overlay and menu.
- Debugging issues.

All design decisions, integration into the existing project structure, tuning, and final review of the code were done by me.
