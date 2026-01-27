import { describe, it, expect } from "vitest";

import Gameboard from "../game/gameboard.js";
import Ship from "../game/ship.js";

describe("Gameboard", () => {
  it("placeShip() creates a Ship instance", () => {
    const gameboard = new Gameboard();
    const coordinates = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];

    const ship = gameboard.placeShip(3, coordinates);

    expect(ship).toBeInstanceOf(Ship);
  });

  it("receiveAttack() does not record a miss when a ship is hit", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [
      [4, 1],
      [5, 1],
    ]);

    gameboard.receiveAttack([4, 1]);

    expect(gameboard.missedShots).toEqual([]);
  });

  it("receiveAttack() records hits", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [
      [4, 1],
      [5, 1],
    ]);

    gameboard.receiveAttack([4, 1]);
    gameboard.receiveAttack([5, 1]);

    expect(gameboard.hitShots).toEqual([
      [4, 1],
      [5, 1],
    ]);
  });

  it("receiveAttack() records missed attacks", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [
      [4, 1],
      [5, 1],
    ]);

    gameboard.receiveAttack([9, 9]);
    gameboard.receiveAttack([8, 8]);

    expect(gameboard.missedShots).toEqual([
      [9, 9],
      [8, 8],
    ]);
  });

  it("receiveAttack() targets the correct ship when multiple ships exist", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(3, [
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    gameboard.placeShip(2, [
      [5, 5],
      [5, 6],
    ]);

    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([5, 6]);

    expect(gameboard.allShipsSunk()).toBe(false);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([2, 0]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  it("allShipsSunk() is false when any ship remains afloat", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [
      [0, 0],
      [1, 0],
    ]);
    gameboard.placeShip(3, [
      [3, 3],
      [4, 3],
      [5, 3],
    ]);

    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);

    expect(gameboard.allShipsSunk()).toBe(false);
  });

  it("allShipsSunk() is true when every ship is sunk", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(2, [
      [0, 0],
      [1, 0],
    ]);
    gameboard.placeShip(3, [
      [3, 3],
      [4, 3],
      [5, 3],
    ]);

    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([3, 3]);
    gameboard.receiveAttack([4, 3]);
    gameboard.receiveAttack([5, 3]);

    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
