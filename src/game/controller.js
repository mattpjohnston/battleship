import Player from "./player.js";

export default class Controller {
  startGame() {
    this.humanPlayer = new Player("human");
    this.computerPlayer = new Player("computer");
    this.currentPlayer = this.humanPlayer;
  }

  placeShipsPreset(player) {
    const humanShips = [
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
      ],
      [
        [0, 4],
        [1, 4],
        [2, 4],
      ],
      [
        [0, 6],
        [1, 6],
        [2, 6],
      ],
      [
        [0, 8],
        [1, 8],
      ],
    ];

    const computerShips = [
      [
        [5, 0],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
      ],
      [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
      ],
      [
        [9, 0],
        [9, 1],
        [9, 2],
      ],
      [
        [9, 5],
        [9, 6],
        [9, 7],
      ],
      [
        [7, 8],
        [7, 9],
      ],
    ];

    const ships = player.type === "human" ? humanShips : computerShips;

    for (let ship of ships) {
      player.gameboard.placeShip(ship.length, ship);
    }
  }

  attack(coord) {
    const beingAttacked =
      this.currentPlayer === this.humanPlayer ? this.computerPlayer : this.humanPlayer;

    return beingAttacked.gameboard.receiveAttack(coord);
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
    if (this.checkGameOver()) {
      if (this.humanPlayer.gameboard.allShipsSunk()) return this.computerPlayer.type;
      else return this.humanPlayer.type;
    }
  }
}
