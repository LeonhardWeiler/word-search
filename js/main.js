'use strict';
import '/css/style.css';

const gridContainer = document.querySelector('.word-grid');
const gridSize = 12;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let cells = [];
let words = [];
let isSelecting = false;

let insertedWords = [];
const showWords = true;

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

  if (showWords) {
    const wordsContainer = document.querySelector('.words');
    wordsContainer.innerHTML = '';
    insertedWords.forEach(word => {
      const div = document.createElement('div');
      div.textContent = word;
      wordsContainer.appendChild(div);
    });
  }
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
  insertedWords.push(word);
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
  clearAllConnections();
  connectSelectedCells();
  updateCorners();
}

// 1. Clear all connection-related classes
function clearAllConnections() {
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
}

// 2. Add connection classes between selected adjacent cells
function connectSelectedCells() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      if (!cell.classList.contains('selected')) continue;

      connectIfSelected(row, col, row - 1, col, 'top', 'bottom');
      connectIfSelected(row, col, row + 1, col, 'bottom', 'top');
      connectIfSelected(row, col, row, col - 1, 'left', 'right');
      connectIfSelected(row, col, row, col + 1, 'right', 'left');
    }
  }
}

function connectIfSelected(r1, c1, r2, c2, dir1, dir2) {
  if (r2 < 0 || c2 < 0 || r2 >= gridSize || c2 >= gridSize) return;
  if (cells[r2][c2].classList.contains('selected')) {
    cells[r1][c1].classList.add(`connected-${dir1}`);
    cells[r2][c2].classList.add(`connected-${dir2}`);
  }
}

// 3. Add or remove corner indicators
function updateCorners() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      clearCorners(cell);
      if (!cell.classList.contains('selected')) continue;

      const neighbors = getNeighborStatus(row, col);

      if (neighbors.top && neighbors.bottom && neighbors.left && neighbors.right) {
        tryAddAllCorners(cell);
        if (neighbors.topLeft)    removeCorner(cell, 'corner-top-left');
        if (neighbors.topRight)   removeCorner(cell, 'corner-top-right');
        if (neighbors.bottomLeft) removeCorner(cell, 'corner-bottom-left');
        if (neighbors.bottomRight)removeCorner(cell, 'corner-bottom-right');
      }

      tryAddCorner(cell, neighbors.top, neighbors.left, neighbors.topLeft, 'corner-top-left');
      tryAddCorner(cell, neighbors.top, neighbors.right, neighbors.topRight, 'corner-top-right');
      tryAddCorner(cell, neighbors.bottom, neighbors.left, neighbors.bottomLeft, 'corner-bottom-left');
      tryAddCorner(cell, neighbors.bottom, neighbors.right, neighbors.bottomRight, 'corner-bottom-right');
    }
  }
}

function clearCorners(cell) {
  const corners = cell.querySelectorAll('.corner');
  corners.forEach(c => c.remove());
}

function getNeighborStatus(row, col) {
  return {
    top: row > 0 && cells[row - 1][col].classList.contains('selected'),
    bottom: row < gridSize - 1 && cells[row + 1][col].classList.contains('selected'),
    left: col > 0 && cells[row][col - 1].classList.contains('selected'),
    right: col < gridSize - 1 && cells[row][col + 1].classList.contains('selected'),

    topLeft: row > 0 && col > 0 && cells[row - 1][col - 1].classList.contains('selected'),
    topRight: row > 0 && col < gridSize - 1 && cells[row - 1][col + 1].classList.contains('selected'),
    bottomLeft: row < gridSize - 1 && col > 0 && cells[row + 1][col - 1].classList.contains('selected'),
    bottomRight: row < gridSize - 1 && col < gridSize - 1 && cells[row + 1][col + 1].classList.contains('selected'),
  };
}

function tryAddCorner(cell, side1, side2, diagonal, className) {
  if (side1 && side2 && !diagonal) {
    addCorner(cell, className);
  }
}

function tryAddAllCorners(cell) {
  addCorner(cell, 'corner-top-left');
  addCorner(cell, 'corner-top-right');
  addCorner(cell, 'corner-bottom-left');
  addCorner(cell, 'corner-bottom-right');
}

function addCorner(cell, positionClass) {
  const div = document.createElement('div');
  div.classList.add('corner', positionClass);
  cell.appendChild(div);
}

function removeCorner(cell, positionClass) {
  const corner = cell.querySelector(`.corner.${positionClass}`);
  if (corner) {
    corner.remove();
  }
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


document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const selectedCells = document.querySelectorAll('.cell.selected');
    const selectedLetters = Array.from(selectedCells).map(cell => cell.textContent).join('');
    const foundWord = insertedWords.find(word => word === selectedLetters);
    if (foundWord) {
      alert(`Found the word: ${foundWord}`);
      selectedCells.forEach(cell => {
        cell.classList.remove('selected');
        cell.classList.add('found');
      });
    } else {
      alert('No matching words found.');
    }
  }
});
