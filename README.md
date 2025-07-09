<h1 align="center">
  water
</h1>

> A custom water system for Roblox that provides realistic swimming mechanics and underwater effects.

<p align="left">
<a alt="Released version" href="https://www.npmjs.com/package/@rbxts/water">
<img src="https://img.shields.io/npm/v/%40rbxts%2Fwater?style=flat-square"></a>
<img alt="Last release date" src="https://img.shields.io/github/release-date/demonlexe/rbxts-water?label=last%20release">
<a alt="Last commit date" href="https://github.com/demonlexe/rbxts-water/commits/main/">
<img src="https://img.shields.io/github/last-commit/demonlexe/rbxts-water/main?style=flat-square"></a>
<a alt="Open issues" href="https://github.com/demonlexe/rbxts-water/issues">
<img src="https://img.shields.io/github/issues/demonlexe/rbxts-water?style=flat-square"></a>
<img alt="Code size" src="https://img.shields.io/github/languages/code-size/demonlexe/rbxts-water?style=flat-square">
<a alt="License" href="https://github.com/demonlexe/rbxts-water/blob/main/LICENSE">
<img src="https://img.shields.io/github/license/demonlexe/rbxts-water?style=flat-square"></a>
</p>

---

<br>

## Features

- **Realistic Swimming**: Smooth swimming mechanics with proper physics
- **Underwater Effects**: Camera effects including fog, color correction, and lighting changes
- **Multiple Water Bodies**: Support for multiple water areas of any shape or size
- **Dynamic Water Detection**: Automatically detects when water parts are added or removed
- **Easy Setup**: Simple function call to initialize the entire water system

## Demo

```ts
import { CreateCustomWater } from "@rbxts/water";

// Initialize the water system
const connection = CreateCustomWater();

// Optional: Disconnect the water system later
// connection.Disconnect();
```

## Installation

Install `water` with your preferred package manager.

### npm

```sh
npm install @rbxts/water
```

### pnpm

```sh
pnpm add @rbxts/water
```

### yarn

```sh
yarn add @rbxts/water
```

## Setup Requirements

### 1. Water Parts Folder

Create a folder named **"WaterParts"** in your Workspace. This folder will contain all the parts that represent water in your game.

### 2. BaseParts for Water

All water objects must be **BaseParts**. A BasePart in Roblox is any physical part that has:
- Position and Size properties
- Can be collided with
- Examples include: `Part`, `WedgePart`, `CornerWedgePart`, `TrussPart`, `UnionOperation`, `MeshPart`, etc.

**Required Properties**:
- `CanCollide` must be set to **false** (so players can pass through the water)
- `Anchored` must be set to **true** (so the water parts don't move or fall)

**Important**: The water system detects water areas based on the 3D bounds (position and size) of these BaseParts. You can use any shape or size, and the system will automatically handle multiple water bodies.

### 3. Client-Side Implementation

The water system must run on the client side under **StarterCharacterScripts**. This ensures it runs for each player when they spawn.

## Usage

### 1. StarterCharacterScripts

If using Rojo,  nclude this in your `default.project.json`
```ts
"StarterPlayer": {
			"$className": "StarterPlayer",
			"StarterCharacterScripts": {
				"$className": "StarterCharacterScripts",
				"TS": {
					"$path": "out/clientChar"
				}
			}
		},
```

Create a file at `src/clientChar/water.client.ts` with the following content:

```ts
import { CreateCustomWater } from "@rbxts/water";

const connection = CreateCustomWater();

// Optional: Disconnect the water system when needed
// connection.Disconnect();
```

### 2. Project Structure

Your project structure should look like this:

```
src/
├── clientChar/
│   └── water.client.ts    // Water system initialization
└── ... other files
```

### 3. In-Game Setup

1. In Roblox Studio, create a folder named **"WaterParts"** in the Workspace
2. Add any BaseParts (Parts, Wedges, etc.) to this folder to represent your water areas
3. **Configure each water part**:
   - Set `CanCollide` to **false** (allows players to pass through)
   - Set `Anchored` to **true** (prevents the parts from moving)
4. The water system will automatically detect all BaseParts in this folder and treat them as water

## Overview

This water system provides:

- **Swimming Mechanics**: Players automatically enter swimming mode when submerged
- **Underwater Camera Effects**: Realistic underwater visual effects including:
  - Color correction with blue tint
  - Reduced saturation and contrast
  - Underwater fog effects
  - Modified lighting and ambient colors
- **Multi-Water Support**: Handle multiple separate water bodies of any shape
- **Dynamic Updates**: Automatically updates when water parts are added or removed from the WaterParts folder

## API Reference

### `CreateCustomWater()`

Initializes the water system for the current player.

**Returns**: `RBXScriptConnection` - The connection to the RunService.Heartbeat event

**Example**:
```ts
import { CreateCustomWater } from "@rbxts/water";

// Start the water system
const waterConnection = CreateCustomWater();

// Later, if you need to stop the water system:
waterConnection.Disconnect();
```

## Troubleshooting

### Water not working?

1. **Check Folder Name**: Ensure you have a folder named exactly "WaterParts" (case-sensitive) in the Workspace
2. **Check Part Types**: Make sure all water objects are BaseParts (Part, WedgePart, MeshPart, etc.)
3. **Check Part Properties**: Ensure all water parts have:
   - `CanCollide` set to **false**
   - `Anchored` set to **true**
4. **Client-Side Script**: Ensure the script is running under StarterCharacterScripts (in clientChar folder)
5. **Character Loading**: The system waits for the player's character to load, so it may take a moment to initialize

### Performance Tips

- Use as few water parts as possible for better performance
- Consider using larger parts instead of many small ones
- The system automatically optimizes by checking bounds efficiently

## Roadmap

- [ ] Configurable water effects (colors, fog density, etc.)
- [ ] Sound effects for entering/exiting water
- [ ] Splash particle effects
- [ ] Customizable swimming speed multipliers
- [ ] Support for different water types (lava, acid, etc.)

## Contributing

If you're interested in contributing to **water**, give the [CONTRIBUTING](CONTRIBUTING.md) doc a read.

## License

[Apache 2.0](/LICENSE)
