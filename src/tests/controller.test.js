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

    it("places ships that do not overlap", () => {
      const controller = new Controller();
      controller.startGame();

      controller.placeShipsRandom(controller.humanPlayer);

      const allCoords = controller.humanPlayer.gameboard.ships.flatMap((entry) => entry.coords);

      for (let i = 0; i < allCoords.length; i++) {
        for (let j = i + 1; j < allCoords.length; j++) {
          const same = allCoords[i][0] === allCoords[j][0] && allCoords[i][1] === allCoords[j][1];
          expect(same).toBe(false);
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

    it("targets adjacent cells after a hit", () => {
      const controller = new Controller();
      controller.startGame();
      controller.humanPlayer.gameboard.placeShip(3, [
        [5, 5],
        [6, 5],
        [7, 5],
      ]);

      controller.aiTargetQueue = [[5, 5]];
      controller.computerAttack();

      const validNeighbors = [
        [4, 5],
        [6, 5],
        [5, 4],
        [5, 6],
      ];

      expect(controller.aiTargetQueue.length).toBeGreaterThan(0);
      for (const coord of controller.aiTargetQueue) {
        expect(validNeighbors.some((n) => n[0] === coord[0] && n[1] === coord[1])).toBe(true);
      }
    });

    it("clears target queue after sinking a ship", () => {
      const controller = new Controller();
      controller.startGame();
      controller.humanPlayer.gameboard.placeShip(2, [
        [5, 5],
        [6, 5],
      ]);

      controller.aiTargetQueue = [[5, 5]];
      controller.computerAttack();

      expect(controller.aiTargetQueue.some((c) => c[0] === 6 && c[1] === 5)).toBe(true);

      controller.aiTargetQueue = controller.aiTargetQueue.filter((c) => c[0] === 6 && c[1] === 5);
      controller.computerAttack();

      expect(controller.aiTargetQueue).toEqual([]);
    });

    it("continues targeting a second ship after sinking the first", () => {
      const controller = new Controller();
      controller.startGame();
      controller.humanPlayer.gameboard.placeShip(2, [
        [0, 0],
        [1, 0],
      ]);
      controller.humanPlayer.gameboard.placeShip(2, [
        [5, 5],
        [6, 5],
      ]);

      controller.humanPlayer.gameboard.receiveAttack([5, 5]);

      controller.aiTargetQueue = [[0, 0]];
      controller.computerAttack();

      controller.aiTargetQueue = [[1, 0]];
      controller.computerAttack();

      const validNeighbors = [
        [4, 5],
        [6, 5],
        [5, 4],
        [5, 6],
      ];

      expect(controller.aiTargetQueue.length).toBeGreaterThan(0);
      for (const coord of controller.aiTargetQueue) {
        expect(validNeighbors.some((n) => n[0] === coord[0] && n[1] === coord[1])).toBe(true);
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
