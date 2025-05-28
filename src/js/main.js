import '../css/style.css';

const gridContainer = document.querySelector('.word-grid');
const timer = document.querySelector('.current-time');
const resetButton = document.querySelector('.reset-game');
const showWordsButton = document.querySelector('.show-words');

const gridSize = 12;
const wordCount = 20;
let showWords = localStorage.getItem('showWords') === 'true' || false;
showWordsButton.textContent = showWords ? 'Show Words: True' : 'Show Words: False';
let animationFrameId;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ';

let cells = [];
let words = [];
let insertedWords = [];
let isSelecting = false;

if (words.length === 0) {
  fetch(`${import.meta.env.BASE_URL}data/wordlist.json`)
    .then(res => res.json())
    .then(data => {
      words = data.wörter.map(w => w.toUpperCase()).filter(w => w.length <= gridSize);
      initGame();
    });
} else {
  initGame();
}

function initGame() {
  const bestTime = localStorage.getItem('bestTime') || '00:00:00';
  const bestTimeDiv = document.querySelector('.best-time');
  bestTimeDiv.textContent = `Best Time: ${bestTime}`;
  if (gridContainer.children.length === 0) {
    createEmptyGrid();
  }
  placeWords(wordCount);
  fillEmptyCells();

  if (showWords) {
    const container = document.querySelector('.container');
    const existingWords = container.querySelectorAll('.words');
    existingWords.forEach(w => w.remove());

    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words');
    container.appendChild(wordsContainer);

    insertedWords.forEach(word => {
      const wordDiv = document.createElement('div');
      wordDiv.textContent = word;
      wordsContainer.appendChild(wordDiv);
    });
  }

  startTimer();
}

function startTimer() {
  let startTime = Date.now();
  timer.textContent = '00:00:00';

  const updateTime = () => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = Math.floor((elapsed % 1000) / 10);

    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

    animationFrameId = requestAnimationFrame(updateTime);
  };

  animationFrameId = requestAnimationFrame(updateTime);
}

function createEmptyGrid() {
  gridContainer.style.setProperty('--size', gridSize);
  cells = [];

  for (let row = 0; row < gridSize; row++) {
    const rowCells = [];
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      gridContainer.appendChild(cell);
      rowCells.push(cell);
    }
    cells.push(rowCells);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function placeWords(maxWords) {
  let insertedCount = 0;
  const usedWords = new Set();

  const allCells = document.querySelectorAll('.cell');
  if (allCells[0].textContent) {
    cells.forEach(row => row.forEach(cell => (cell.textContent = '')));
    insertedWords = [];
  }

  shuffleArray(words);

  for (const word of words) {
    if (insertedCount >= maxWords) break;
    if (usedWords.has(word)) continue;

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction = Math.random() < 0.5 ? 'HORIZONTAL' : 'VERTICAL';
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlace(word, row, col, direction)) {
        insertWord(word, row, col, direction);
        insertedWords.push(word);
        usedWords.add(word);
        insertedCount++;
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
  } else {
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
    } else {
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
  clearAllConnections();
  connectSelectedCells();
  updateCorners();
}

function clearAllConnections() {
  cells.flat().forEach(cell => {
    if (!cell.classList.contains('found')) {
      cell.classList.remove(
        'connected-top',
        'connected-bottom',
        'connected-left',
        'connected-right'
      );
    }
  });
}

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

function updateCorners() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = cells[row][col];
      clearCorners(cell);
      if (!cell.classList.contains('selected')) continue;

      const neighbors = getNeighborStatus(row, col);

      if (neighbors.top && neighbors.bottom && neighbors.left && neighbors.right) {
        tryAddAllCorners(cell);
        if (neighbors.topLeft) removeCorner(cell, 'corner-top-left');
        if (neighbors.topRight) removeCorner(cell, 'corner-top-right');
        if (neighbors.bottomLeft) removeCorner(cell, 'corner-bottom-left');
        if (neighbors.bottomRight) removeCorner(cell, 'corner-bottom-right');
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
  const cornerDiv = document.createElement('div');
  cornerDiv.classList.add('corner', positionClass);
  cell.appendChild(cornerDiv);
}

function removeCorner(cell, positionClass) {
  const corner = cell.querySelector(`.corner.${positionClass}`);
  if (corner) corner.remove();
}

function getLightColorPair() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70;
  const lightness = Math.floor(Math.random() * 20) + 70;

  return {
    border: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    background: `hsl(${hue}, ${saturation}%, ${lightness + 5}%)`
  };
}

function checkIfFoundWord() {
  const selectedCells = document.querySelectorAll('.cell.selected');
  const selectedLetters = Array.from(selectedCells).map(cell => cell.textContent).join('');
  const foundWord = insertedWords.find(word => word === selectedLetters);

  if (foundWord) {
    const cellPositions = Array.from(selectedCells).map(cell => ({
      row: parseInt(cell.dataset.row, 10),
      col: parseInt(cell.dataset.col, 10),
    }));

    const isHorizontal = cellPositions.every((pos, i, arr) =>
      pos.row === arr[0].row && pos.col === arr[0].col + i
    );

    const isVertical = cellPositions.every((pos, i, arr) =>
      pos.col === arr[0].col && pos.row === arr[0].row + i
    );

    if (isHorizontal || isVertical) {
      const { background, border } = getLightColorPair();
      selectedCells.forEach(cell => {
        cell.classList.remove('selected');
        cell.style.setProperty('--background-color-found', background);
        cell.style.setProperty('--border-color-found', border);
        cell.classList.add('found');
      });

      const wordsContainer = document.querySelector('.words');
      const wordDiv = Array.from(wordsContainer.children).find(div => div.textContent === foundWord);
      if (wordDiv) wordDiv.remove();

      if (wordsContainer.children.length === 0) {
        gameFinished();
      }
    }
  }
}

function gameFinished() {
  cancelAnimationFrame(animationFrameId);
  const wordsContainer = document.querySelector('.words');
  wordsContainer.textContent = 'Congratulations! You found all words!';

  const currentTime = document.querySelector('.current-time').textContent;
  const previousTime = localStorage.getItem('bestTime') || '00:00:00';
  console.log(`${currentTime} ${previousTime}`)
  const currentTimeNumber = getTimeInSeconds(currentTime);
  const previousTimeNumber = getTimeInSeconds(previousTime);
  console.log(currentTimeNumber, previousTimeNumber);
  if (currentTimeNumber < previousTimeNumber || previousTimeNumber === 0) {
    console.log(currentTimeNumber, previousTimeNumber);
    localStorage.setItem('bestTime', currentTime);
    wordsContainer.textContent += ` New best time: ${currentTime}`;
    document.querySelector('.best-time').textContent = `Best Time: ${currentTime}`;
  }
}

function getTimeInSeconds(timeString) {
  const parts = timeString.split(':').map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
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
    e.target.classList.add('selected');
    updateConnections();
  }
});

document.addEventListener('mouseup', () => {
  isSelecting = false;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    checkIfFoundWord();
  } else if (e.key === 'Escape') {
    cells.forEach(row => row.forEach(cell => cell.classList.remove('selected')));
    updateConnections();
  } else if (e.key === '0') {
    resetButton.click();
  } else if (e.key === '1') {
    showWordsButton.click();
  }
});

resetButton.addEventListener('click', () => {
  cells.forEach(row => row.forEach(cell => cell.classList.remove('selected', 'found')));
  cancelAnimationFrame(animationFrameId);
  initGame();
});

showWordsButton.addEventListener('click', () => {
  showWords = !showWords;
  localStorage.setItem('showWords', showWords);
  const wordsGrid = document.querySelector('.words');

  if (wordsGrid) {
    wordsGrid.remove();
  } else {
    const container = document.querySelector('.container');
    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words');
    container.appendChild(wordsContainer);

    insertedWords.forEach(word => {
      const wordDiv = document.createElement('div');
      wordDiv.textContent = word;
      wordsContainer.appendChild(wordDiv);
    });
  }

  showWordsButton.textContent = showWords ? 'Show Words: True' : 'Show Words: False';

  cells.forEach(row => row.forEach(cell => cell.classList.remove('selected', 'found')));
  cancelAnimationFrame(animationFrameId);
  initGame();
});
