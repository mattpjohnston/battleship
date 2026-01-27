import Ship from "./ship.js";

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedShots = [];
    this.hitShots = [];
  }

  placeShip(length, coords) {
    const ship = new Ship(length);
    this.ships.push({ ship, coords });
    return ship;
  }

  receiveAttack(coord) {
    for (const entry of this.ships) {
      for (const square of entry.coords) {
        if (square[0] === coord[0] && square[1] === coord[1]) {
          entry.ship.hit();
          this.hitShots.push(coord);
          return;
        }
      }
    }

    this.missedShots.push(coord);
  }

  allShipsSunk() {
    let allSunk = true;
    for (let ship of this.ships) {
      if (!ship.ship.isSunk()) allSunk = false;
    }
    return allSunk;
  }
}
