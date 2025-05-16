'use strict';
import '/css/style.css';

const gridContainer = document.querySelector('.word-grid');
const gridSize = 10;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let cells = [];
let words = [];
let isSelecting = false;

fetch('wordlist.json')
  .then(res => res.json())
  .then(data => {
    words = data.wörter.map(w => w.toUpperCase()).filter(w => w.length <= gridSize);
    initGame();
  });

function initGame() {
  createEmptyGrid();
  placeWords();
  fillEmptyCells();
}

function createEmptyGrid() {
  gridContainer.style.setProperty('--size', gridSize);
  cells = [];

  for (let row = 0; row < gridSize; row++) {
    const rowCells = [];
    for (let col = 0; col < gridSize; col++) {
      const div = document.createElement('div');
      div.classList.add('cell');
      div.dataset.row = row;
      div.dataset.col = col;
      gridContainer.appendChild(div);
      rowCells.push(div);
    }
    cells.push(rowCells);
  }
}

function placeWords() {
  for (const word of words) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction = Math.random() < 0.5 ? 'HORIZONTAL' : 'VERTICAL';
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlace(word, row, col, direction)) {
        insertWord(word, row, col, direction);
        placed = true;
      }
      attempts++;
    }
  }
}

function canPlace(word, row, col, direction) {
  if (direction === 'HORIZONTAL') {
    if (col + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = cells[row][col + i];
      if (cell.textContent && cell.textContent !== word[i]) return false;
    }
  } else if (direction === 'VERTICAL') {
    if (row + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = cells[row + i][col];
      if (cell.textContent && cell.textContent !== word[i]) return false;
    }
  }
  return true;
}

function insertWord(word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    if (direction === 'HORIZONTAL') {
      cells[row][col + i].textContent = letter;
    } else if (direction === 'VERTICAL') {
      cells[row + i][col].textContent = letter;
    }
  }
}

function fillEmptyCells() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      if (!cell.textContent) {
        cell.textContent = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function updateConnections() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      cell.classList.remove(
        'connected-top',
        'connected-bottom',
        'connected-left',
        'connected-right'
      );
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      if (!cell.classList.contains('selected')) continue;

      if (row > 0 && cells[row - 1][col].classList.contains('selected')) {
        cell.classList.add('connected-top');
        cells[row - 1][col].classList.add('connected-bottom');
      }

      if (row < gridSize - 1 && cells[row + 1][col].classList.contains('selected')) {
        cell.classList.add('connected-bottom');
        cells[row + 1][col].classList.add('connected-top');
      }

      if (col > 0 && cells[row][col - 1].classList.contains('selected')) {
        cell.classList.add('connected-left');
        cells[row][col - 1].classList.add('connected-right');
      }

      if (col < gridSize - 1 && cells[row][col + 1].classList.contains('selected')) {
        cell.classList.add('connected-right');
        cells[row][col + 1].classList.add('connected-left');
      }
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];

      // Alte Ecken entfernen
      const oldCorners = cell.querySelectorAll('.corner');
      oldCorners.forEach(c => c.remove());

      if (!cell.classList.contains('selected')) continue;

      // Nachbarn prüfen
      const top    = row > 0 && cells[row - 1][col].classList.contains('selected');
      const bottom = row < gridSize - 1 && cells[row + 1][col].classList.contains('selected');
      const left   = col > 0 && cells[row][col - 1].classList.contains('selected');
      const right  = col < gridSize - 1 && cells[row][col + 1].classList.contains('selected');

      const topLeft     = row > 0 && col > 0 && cells[row - 1][col - 1].classList.contains('selected');
      const topRight    = row > 0 && col < gridSize - 1 && cells[row - 1][col + 1].classList.contains('selected');
      const bottomLeft  = row < gridSize - 1 && col > 0 && cells[row + 1][col - 1].classList.contains('selected');
      const bottomRight = row < gridSize - 1 && col < gridSize - 1 && cells[row + 1][col + 1].classList.contains('selected');

      // Ecken nur hinzufügen, wenn es wirklich Ecken sind
      if (!top && !left && !topLeft) {
        addCorner(cell, 'top-left');
      }

      if (!top && !right && !topRight) {
        addCorner(cell, 'top-right');
      }

      // Für die unteren Ecken zusätzlich prüfen, dass nicht beide Nachbarn verbunden sind
      if (!bottom && !left && !bottomLeft && !(left && bottom)) {
        addCorner(cell, 'bottom-left');
      }

      if (!bottom && !right && !bottomRight && !(right && bottom)) {
        addCorner(cell, 'bottom-right');
      }
    }
  }
}

function addCorner(cell, positionClass) {
  const div = document.createElement('div');
  div.classList.add('corner', positionClass);
  cell.appendChild(div);
}

gridContainer.addEventListener('mousedown', e => {
  if (e.target.classList.contains('cell')) {
    isSelecting = true;
    e.target.classList.toggle('selected');
    updateConnections();
  }
});

gridContainer.addEventListener('mouseover', e => {
  if (isSelecting && e.target.classList.contains('cell')) {
    e.target.classList.toggle('selected');
    updateConnections();
  }
});

document.addEventListener('mouseup', () => {
  isSelecting = false;
});

