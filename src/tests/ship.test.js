import { describe, it, expect } from "vitest";

import Ship from "../game/ship.js";

describe("Ship", () => {
  it("exposes a length set at creation time", () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
  });

  it("exposes hits and starts at 0", () => {
    const ship = new Ship(3);
    expect(ship.hits).toBe(0);
  });

  it("is not sunk initially", () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
  });

  it("hit() increases hits by 1", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  it("hit() increases hits cumulatively", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  it("isSunk() is false when hits < length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  it("isSunk() is true when hits === length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  it("isSunk() stays true once sunk", () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);

    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  it.each([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
  ])("sinks exactly after %i hits for a ship of length %i", (hits, len) => {
    const ship = new Ship(len);

    for (let i = 0; i < len - 1; i += 1) ship.hit();
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
