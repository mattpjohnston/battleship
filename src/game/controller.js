import Player from "./player.js";

export default class Controller {
  startGame() {
    this.humanPlayer = new Player("real");
    this.computerPlayer = new Player("computer");
    this.currentPlayer = this.humanPlayer;
    this.aiTargetQueue = [];
  }

  placeShipsRandom(player) {
    player.gameboard.ships = [];

    const shipLengths = [5, 4, 3, 3, 2];

    for (const length of shipLengths) {
      let placed = false;

      while (!placed) {
        const coords = this.generateRandomCoords(length);

        if (this.isValidPlacement(player, coords)) {
          player.gameboard.placeShip(length, coords);
          placed = true;
        }
      }
    }
  }

  generateRandomCoords(length) {
    const isHorizontal = Math.random() < 0.5;
    const coords = [];

    if (isHorizontal) {
      const x = Math.floor(Math.random() * (10 - length + 1));
      const y = Math.floor(Math.random() * 10);

      for (let i = 0; i < length; i++) {
        coords.push([x + i, y]);
      }
    } else {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * (10 - length + 1));

      for (let i = 0; i < length; i++) {
        coords.push([x, y + i]);
      }
    }

    return coords;
  }

  isValidPlacement(player, coords) {
    for (const coord of coords) {
      if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) {
        return false;
      }

      for (const entry of player.gameboard.ships) {
        for (const shipCoord of entry.coords) {
          if (coord[0] === shipCoord[0] && coord[1] === shipCoord[1]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  attack(coord) {
    const beingAttacked =
      this.currentPlayer === this.humanPlayer ? this.computerPlayer : this.humanPlayer;

    const wasHit = beingAttacked.gameboard.receiveAttack(coord);
    return wasHit ? "hit" : "miss";
  }

  switchTurn() {
    this.currentPlayer =
      this.currentPlayer === this.humanPlayer ? this.computerPlayer : this.humanPlayer;
  }

  computerAttack() {
    const board = this.humanPlayer.gameboard;

    this.aiTargetQueue = this.aiTargetQueue.filter((c) => !this.alreadyAttacked(c, board));

    let coord;
    if (this.aiTargetQueue.length > 0) {
      coord = this.aiTargetQueue.shift();
    } else {
      do {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        coord = [x, y];
      } while (this.alreadyAttacked(coord, board));
    }

    const wasHit = board.receiveAttack(coord);

    if (wasHit) {
      const shipEntry = board.ships.find((entry) =>
        entry.coords.some((c) => c[0] === coord[0] && c[1] === coord[1]),
      );

      if (shipEntry.ship.isSunk()) {
        this.rebuildTargetQueue(board);
      } else {
        for (const neighbor of this.getValidNeighbors(coord, board)) {
          if (!this.aiTargetQueue.some((c) => c[0] === neighbor[0] && c[1] === neighbor[1])) {
            this.aiTargetQueue.push(neighbor);
          }
        }
      }
    }

    return coord;
  }

  getValidNeighbors(coord, board) {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    const neighbors = [];

    for (const [dx, dy] of directions) {
      const neighbor = [coord[0] + dx, coord[1] + dy];

      if (
        neighbor[0] >= 0 &&
        neighbor[0] <= 9 &&
        neighbor[1] >= 0 &&
        neighbor[1] <= 9 &&
        !this.alreadyAttacked(neighbor, board)
      ) {
        neighbors.push(neighbor);
      }
    }

    // Shuffle so the AI doesn't always try the same direction first
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }

    return neighbors;
  }

  rebuildTargetQueue(board) {
    this.aiTargetQueue = [];
    for (const entry of board.ships) {
      if (entry.ship.isSunk()) continue;
      for (const coord of entry.coords) {
        const isHit = board.hitShots.some((h) => h[0] === coord[0] && h[1] === coord[1]);
        if (isHit) {
          for (const neighbor of this.getValidNeighbors(coord, board)) {
            if (!this.aiTargetQueue.some((c) => c[0] === neighbor[0] && c[1] === neighbor[1])) {
              this.aiTargetQueue.push(neighbor);
            }
          }
        }
      }
    }
  }

  alreadyAttacked(coord, board) {
    const allShots = [...board.hitShots, ...board.missedShots];
    return allShots.some((shot) => shot[0] === coord[0] && shot[1] === coord[1]);
  }

  checkGameOver() {
    if (!this.humanPlayer.gameboard.allShipsSunk() && !this.computerPlayer.gameboard.allShipsSunk())
      return false;
    return true;
  }

  getWinner() {
    if (this.computerPlayer.gameboard.allShipsSunk()) return "human";
    if (this.humanPlayer.gameboard.allShipsSunk()) return "computer";
    return null;
  }
}
