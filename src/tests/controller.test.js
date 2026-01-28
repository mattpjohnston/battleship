import { describe, it, expect, beforeEach } from "vitest";

import Controller from "../game/controller.js";
import Player from "../game/player.js";

describe("Controller", () => {
  describe("startGame()", () => {
    it("creates a human player and a computer player", () => {
      const controller = new Controller();

      controller.startGame();

      expect(controller.humanPlayer).toBeInstanceOf(Player);
      expect(controller.computerPlayer).toBeInstanceOf(Player);
    });

    it("sets the human player to go first", () => {
      const controller = new Controller();

      controller.startGame();

      expect(controller.currentPlayer).toBe(controller.humanPlayer);
    });
  });

  describe("placeShipsPreset()", () => {
    it("populates a player's gameboard with ships", () => {
      const controller = new Controller();
      controller.startGame();

      controller.placeShipsPreset(controller.humanPlayer);

      expect(controller.humanPlayer.gameboard.ships.length).toBeGreaterThan(0);
    });
  });

  describe("attack()", () => {
    let controller;

    beforeEach(() => {
      controller = new Controller();
      controller.startGame();
      controller.placeShipsPreset(controller.humanPlayer);
      controller.placeShipsPreset(controller.computerPlayer);
    });

    it("attacks the enemy gameboard at the given coordinate", () => {
      controller.attack([0, 0]);

      const totalShots =
        controller.computerPlayer.gameboard.missedShots.length +
        controller.computerPlayer.gameboard.hitShots.length;

      expect(totalShots).toBe(1);
    });

    it("returns true when attack hits a ship", () => {
      const shipCoord = controller.computerPlayer.gameboard.ships[0].coords[0];

      const result = controller.attack(shipCoord);

      expect(result).toBe(true);
    });

    it("returns false when attack misses", () => {
      const result = controller.attack([9, 9]);

      expect(result).toBe(false);
    });
  });

  describe("switchTurn()", () => {
    it("switches between human and computer players", () => {
      const controller = new Controller();
      controller.startGame();

      expect(controller.currentPlayer).toBe(controller.humanPlayer);

      controller.switchTurn();

      expect(controller.currentPlayer).toBe(controller.computerPlayer);

      controller.switchTurn();

      expect(controller.currentPlayer).toBe(controller.humanPlayer);
    });
  });

  describe("computerAttack()", () => {
    let controller;

    beforeEach(() => {
      controller = new Controller();
      controller.startGame();
      controller.placeShipsPreset(controller.humanPlayer);
      controller.placeShipsPreset(controller.computerPlayer);
    });

    it("attacks the human player's gameboard", () => {
      controller.computerAttack();

      const totalShots =
        controller.humanPlayer.gameboard.missedShots.length +
        controller.humanPlayer.gameboard.hitShots.length;

      expect(totalShots).toBe(1);
    });

    it("only makes legal moves (does not attack same coordinate twice)", () => {
      const attackedCoords = [];

      for (let i = 0; i < 10; i++) {
        const coord = controller.computerAttack();
        const isDuplicate = attackedCoords.some((c) => c[0] === coord[0] && c[1] === coord[1]);

        expect(isDuplicate).toBe(false);
        attackedCoords.push(coord);
      }
    });
  });

  describe("checkGameOver()", () => {
    it("returns false when ships remain afloat", () => {
      const controller = new Controller();
      controller.startGame();
      controller.placeShipsPreset(controller.humanPlayer);
      controller.placeShipsPreset(controller.computerPlayer);

      expect(controller.checkGameOver()).toBe(false);
    });

    it("returns true when all of a player's ships are sunk", () => {
      const controller = new Controller();
      controller.startGame();

      controller.humanPlayer.gameboard.placeShip(2, [
        [0, 0],
        [1, 0],
      ]);
      controller.computerPlayer.gameboard.placeShip(2, [
        [0, 0],
        [1, 0],
      ]);

      controller.computerPlayer.gameboard.receiveAttack([0, 0]);
      controller.computerPlayer.gameboard.receiveAttack([1, 0]);

      expect(controller.checkGameOver()).toBe(true);
    });
  });

  describe("getWinner()", () => {
    it("returns the winner when the game is over", () => {
      const controller = new Controller();
      controller.startGame();

      controller.humanPlayer.gameboard.placeShip(2, [
        [0, 0],
        [1, 0],
      ]);
      controller.computerPlayer.gameboard.placeShip(2, [
        [0, 0],
        [1, 0],
      ]);

      controller.computerPlayer.gameboard.receiveAttack([0, 0]);
      controller.computerPlayer.gameboard.receiveAttack([1, 0]);

      expect(controller.getWinner()).toBe("human");
    });
  });
});
