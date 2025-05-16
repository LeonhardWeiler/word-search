'use strict';
import '/css/style.css';

const gridContainer = document.querySelector('.word-grid');
const gridSize = 12;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let cells = [];
let words = [];

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


