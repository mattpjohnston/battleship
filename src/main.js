import Controller from "./game/controller.js";
import { renderBoard, updateMessage, getCoordsFromCell, setGameOver, resetUI } from "./ui/dom.js";

const placementPhase = document.getElementById("placement-phase");
const placementBoard = document.getElementById("placement-board");
const randomiseBtn = document.getElementById("randomise-btn");
const startBtn = document.getElementById("start-btn");

const gamePhase = document.getElementById("game-phase");
const humanBoardEl = document.getElementById("human-board");
const computerBoardEl = document.getElementById("computer-board");
const newGameBtn = document.getElementById("new-game");

let controller;

initPlacement();

randomiseBtn.addEventListener("click", randomiseShips);
startBtn.addEventListener("click", startGame);
computerBoardEl.addEventListener("click", handleAttack);
newGameBtn.addEventListener("click", initPlacement);

function initPlacement() {
  controller = new Controller();
  controller.startGame();
  controller.placeShipsRandom(controller.humanPlayer);

  renderBoard(placementBoard, controller.humanPlayer.gameboard, false);

  placementPhase.classList.remove("hidden");
  gamePhase.classList.add("hidden");
  resetUI();
  updateMessage("Position your fleet, Captain.");
}

function randomiseShips() {
  controller.placeShipsRandom(controller.humanPlayer);
  renderBoard(placementBoard, controller.humanPlayer.gameboard, false);
  updateMessage("Fleet repositioned. Deploy when ready.");
}

function startGame() {
  controller.placeShipsRandom(controller.computerPlayer);

  placementPhase.classList.add("hidden");
  gamePhase.classList.remove("hidden");

  renderBoard(humanBoardEl, controller.humanPlayer.gameboard, false);
  renderBoard(computerBoardEl, controller.computerPlayer.gameboard, true);

  updateMessage("Engage the enemy, Captain.");
}

function handleAttack(e) {
  const cell = e.target;

  // Only handle clicks on cells that haven't been attacked
  if (!cell.classList.contains("cell")) return;
  if (cell.classList.contains("hit") || cell.classList.contains("miss")) return;
  if (controller.checkGameOver()) return;

  const coord = getCoordsFromCell(cell);
  const result = controller.attack(coord);

  // Rerender to show the attack result
  renderBoard(computerBoardEl, controller.computerPlayer.gameboard, true);

  if (result === "hit") {
    updateMessage("Direct hit!");
  } else {
    updateMessage("Miss.");
  }

  // Check if player won
  if (controller.checkGameOver()) {
    setGameOver(true);
    return;
  }

  setTimeout(computerTurn, 1000);
}

function computerTurn() {
  const coord = controller.computerAttack();

  // Rerender to show computer's attack
  renderBoard(humanBoardEl, controller.humanPlayer.gameboard, false);

  // Check if it was a hit or miss for the message
  const wasHit = controller.humanPlayer.gameboard.hitShots.some(
    (shot) => shot[0] === coord[0] && shot[1] === coord[1],
  );

  if (wasHit) {
    updateMessage("We've been hit! Return fire!");
  } else {
    updateMessage("Enemy missed. Your move, Captain.");
  }

  // Check if computer won
  if (controller.checkGameOver()) {
    setGameOver(false);
  }
}
