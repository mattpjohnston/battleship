export function renderBoard(boardElement, gameboard, hideShips = false) {
  boardElement.innerHTML = "";

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (!hideShips) {
        const hasShip = gameboard.ships.some((entry) =>
          entry.coords.some((coord) => coord[0] === x && coord[1] === y),
        );
        if (hasShip) {
          cell.classList.add("ship");
        }
      }

      const isHit = gameboard.hitShots.some((coord) => coord[0] === x && coord[1] === y);
      if (isHit) {
        cell.classList.add("hit");
      }

      const isMiss = gameboard.missedShots.some((coord) => coord[0] === x && coord[1] === y);
      if (isMiss) {
        cell.classList.add("miss");
      }

      boardElement.appendChild(cell);
    }
  }
}

export function updateMessage(text) {
  document.getElementById("message").textContent = text;
}

export function getCoordsFromCell(cell) {
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  return [x, y];
}

export function setGameOver(isVictory) {
  const message = document.getElementById("message");

  if (isVictory) {
    message.textContent = "Victory! Enemy fleet destroyed.";
    message.classList.add("victory");
  } else {
    message.textContent = "Defeat. Our fleet is lost.";
    message.classList.add("defeat");
  }
}

export function resetUI() {
  const message = document.getElementById("message");
  message.classList.remove("victory", "defeat");
}
