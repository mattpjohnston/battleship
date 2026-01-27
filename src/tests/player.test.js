import { describe, it, expect } from "vitest";

import Player from "../game/player.js";

describe("Player", () => {
  it("creates a real player with a gameboard", () => {
    const player = new Player("real");

    expect(player.type).toBe("real");
    expect(player.gameboard).toBeDefined();
    expect(typeof player.gameboard.placeShip).toBe("function");
    expect(typeof player.gameboard.receiveAttack).toBe("function");
    expect(typeof player.gameboard.allShipsSunk).toBe("function");
  });

  it("creates a computer player with a gameboard", () => {
    const player = new Player("computer");

    expect(player.type).toBe("computer");
    expect(player.gameboard).toBeDefined();
  });

  it("gives each player their own gameboard", () => {
    const realPlayer = new Player("real");
    const computerPlayer = new Player("computer");

    expect(realPlayer.gameboard).not.toBe(computerPlayer.gameboard);
  });
});
