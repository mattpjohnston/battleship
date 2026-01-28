import Player from "./player.js";

export default class Controller {
  startGame() {
    this.humanPlayer = new Player("real");
    this.computerPlayer = new Player("computer");
    this.currentPlayer = this.humanPlayer;
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
          if (Math.abs(coord[0] - shipCoord[0]) <= 1 && Math.abs(coord[1] - shipCoord[1]) <= 1) {
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
    let coord;

    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      coord = [x, y];
    } while (this.alreadyAttacked(coord, board));

    board.receiveAttack(coord);
    return coord;
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
