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

  describe("placeShipsRandom()", () => {
    it("populates a player's gameboard with ships", () => {
      const controller = new Controller();
      controller.startGame();

      controller.placeShipsRandom(controller.humanPlayer);

      expect(controller.humanPlayer.gameboard.ships.length).toBe(5);
    });

    it("places ships that do not touch each other", () => {
      const controller = new Controller();
      controller.startGame();

      controller.placeShipsRandom(controller.humanPlayer);

      const allCoords = controller.humanPlayer.gameboard.ships.flatMap((entry) => entry.coords);

      for (const entry of controller.humanPlayer.gameboard.ships) {
        for (const coord of entry.coords) {
          for (const otherEntry of controller.humanPlayer.gameboard.ships) {
            if (entry === otherEntry) continue;
            for (const otherCoord of otherEntry.coords) {
              const xDiff = Math.abs(coord[0] - otherCoord[0]);
              const yDiff = Math.abs(coord[1] - otherCoord[1]);
              expect(xDiff > 1 || yDiff > 1).toBe(true);
            }
          }
        }
      }
    });
  });

  describe("attack()", () => {
    let controller;

    beforeEach(() => {
      controller = new Controller();
      controller.startGame();
      controller.placeShipsRandom(controller.humanPlayer);
      controller.placeShipsRandom(controller.computerPlayer);
    });

    it("attacks the enemy gameboard at the given coordinate", () => {
      controller.attack([0, 0]);

      const totalShots =
        controller.computerPlayer.gameboard.missedShots.length +
        controller.computerPlayer.gameboard.hitShots.length;

      expect(totalShots).toBe(1);
    });

    it("returns 'hit' when attack hits a ship", () => {
      const shipCoord = controller.computerPlayer.gameboard.ships[0].coords[0];

      const result = controller.attack(shipCoord);

      expect(result).toBe("hit");
    });

    it("returns 'miss' when attack misses", () => {
      const shipCoords = controller.computerPlayer.gameboard.ships.flatMap((e) => e.coords);
      let missCoord = [0, 0];

      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          if (!shipCoords.some((c) => c[0] === x && c[1] === y)) {
            missCoord = [x, y];
            break;
          }
        }
      }

      const result = controller.attack(missCoord);

      expect(result).toBe("miss");
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
      controller.placeShipsRandom(controller.humanPlayer);
      controller.placeShipsRandom(controller.computerPlayer);
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
      controller.placeShipsRandom(controller.humanPlayer);
      controller.placeShipsRandom(controller.computerPlayer);

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
