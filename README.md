# Battleship

A Battleship game built for The Odin Project, featuring a Greyhound movie-inspired theme set in the North Atlantic, 1942.

## Features

- **Ship Placement** - Randomise your fleet positioning before battle
- **Turn-based Combat** - Click enemy waters to attack, then the computer responds
- **Computer AI** - Makes random legal moves (never attacks the same coordinate twice)
- **Win/Lose Detection** - Game ends when all ships of either player are sunk
- **Greyhound Theme** - Dark, moody aesthetic inspired by the WWII naval film

## Built With

- JavaScript (ES modules)
- Vite
- Vitest
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js

### Installation

```bash
npm install
```

### Run

```bash
npm run dev
```

### Tests

```bash
npm test
```

## Project Structure

```
src/
├── game/
│   ├── ship.js        # Ship model with hit tracking
│   ├── gameboard.js   # Board with ship placement and attack handling
│   ├── player.js      # Player with their own gameboard
│   └── controller.js  # Game logic and turn management
├── ui/
│   └── dom.js         # DOM rendering functions
├── tests/
│   ├── ship.test.js
│   ├── gameboard.test.js
│   ├── player.test.js
│   └── controller.test.js
└── main.js            # Entry point, event listeners
```

## How to Play

1. **Position Your Fleet** - Click "Randomise Fleet" until you're happy with the placement
2. **Deploy** - Click "Deploy Fleet" to start the battle
3. **Attack** - Click on the enemy board to fire
4. **Survive** - Sink all enemy ships before they sink yours

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/)
- Greyhound (2020) for the theme inspiration
