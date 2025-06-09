const grid = document.getElementById('grid');
const nextPieceDisplay = document.getElementById('next-piece');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

const width = 10;
const gridCells = [];
let currentPosition = 4;
let currentRotation = 0;
let currentTetromino;
let nextTetromino;
let timerId;
let score = 0;
let level = 1;
let linesCleared = 0;


function createGrid() {
  grid.innerHTML = '';
  gridCells.length = 0;

  for (let i = 0; i < 200; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
    gridCells.push(cell);
  }

  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell', 'taken');
    grid.appendChild(cell);
    gridCells.push(cell);
  }
}

createGrid();

const tetrominoes = [
  { shape: [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ], color: 'orange' },
  { shape: [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ], color: 'red' },
  { shape: [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ], color: 'purple' },
  { shape: [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ], color: 'yellow' },
  { shape: [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ], color: 'cyan' }
];

function draw() {
  currentTetromino.shape[currentRotation].forEach(index => {
    gridCells[currentPosition + index].classList.add('tetromino');
    gridCells[currentPosition + index].style.backgroundColor = currentTetromino.color;
  });
}

function undraw() {
  currentTetromino.shape[currentRotation].forEach(index => {
    gridCells[currentPosition + index].classList.remove('tetromino');
    gridCells[currentPosition + index].style.backgroundColor = '';
  });
}

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function freeze() {
  if (currentTetromino.shape[currentRotation].some(index =>
    gridCells[currentPosition + index + width].classList.contains('taken'))) {
    currentTetromino.shape[currentRotation].forEach(index => {
      gridCells[currentPosition + index].classList.add('taken');
    });
    startNewPiece();
    addScore();
    checkGameOver();
  }
}

function startNewPiece() {
  currentTetromino = nextTetromino || randomTetromino();
  nextTetromino = randomTetromino();
  currentPosition = 4;
  currentRotation = 0;
  draw();
  displayNextPiece();
}

function randomTetromino() {
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

startButton.addEventListener('click', () => {
  clearInterval(timerId);
  createGrid();
  score = 0;
  scoreDisplay.textContent = score;
  document.getElementById('level').textContent = level;
  nextTetromino = randomTetromino();
  startNewPiece();
  timerId = setInterval(moveDown, 800);
});

const displayCells = [];
function createNextDisplay() {
  nextPieceDisplay.innerHTML = '';
  displayCells.length = 0;
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    nextPieceDisplay.appendChild(cell);
    displayCells.push(cell);
  }
}

function displayNextPiece() {
  displayCells.forEach(cell => {
    cell.classList.remove('tetromino');
    cell.style.backgroundColor = '';
  });
  nextTetromino.shape[0].forEach(index => {
    displayCells[index].classList.add('tetromino');
    displayCells[index].style.backgroundColor = nextTetromino.color;
  });
}

createNextDisplay();

function addScore() {
  let linesThisTurn = 0;

  for (let i = 0; i < 199; i += width) {
    const row = [...Array(width)].map((_, j) => i + j);
    if (row.every(index => gridCells[index].classList.contains('taken'))) {
      linesThisTurn++;
      row.forEach(index => {
        gridCells[index].classList.remove('taken', 'tetromino');
        gridCells[index].style.backgroundColor = '';
      });

      const removed = gridCells.splice(i, width);
      gridCells.unshift(...removed);
      grid.innerHTML = '';
      gridCells.forEach(cell => grid.appendChild(cell));
    }
  }

  if (linesThisTurn > 0) {
    linesCleared += linesThisTurn;

    level = Math.floor(linesCleared / 10) + 1;

    const scoreTable = [0, 40, 100, 300, 1200];
    score += scoreTable[linesThisTurn] * level;
    scoreDisplay.textContent = score;
  }
}


function checkGameOver() {
  if (currentTetromino.shape[currentRotation].some(index =>
    gridCells[currentPosition + index].classList.contains('taken'))) {
    clearInterval(timerId);
    alert('Fim de jogo!');
  }
}

function moveLeft() {
  undraw();
  const atLeftEdge = currentTetromino.shape[currentRotation].some(index =>
    (currentPosition + index) % width === 0);
  if (!atLeftEdge) currentPosition -= 1;
  if (currentTetromino.shape[currentRotation].some(index =>
    gridCells[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const atRightEdge = currentTetromino.shape[currentRotation].some(index =>
    (currentPosition + index) % width === width - 1);
  if (!atRightEdge) currentPosition += 1;
  if (currentTetromino.shape[currentRotation].some(index =>
    gridCells[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
}

function rotate() {
  undraw();
  const prevRotation = currentRotation;
  currentRotation = (currentRotation + 1) % currentTetromino.shape.length;
  const isBlocked = currentTetromino.shape[currentRotation].some(index => {
    const pos = currentPosition + index;
    return (
      pos < 0 ||
      pos >= 200 ||
      gridCells[pos].classList.contains('taken') ||
      (pos % width === 0 && index % width === width - 1) ||
      (pos % width === width - 1 && index % width === 0)
    );
  });
  if (isBlocked) currentRotation = prevRotation;
  draw();
}

function control(e) {
  if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === 'ArrowLeft') {
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    moveRight();
  } else if (e.key === 'ArrowDown') {
    moveDown();
  } else if (e.key === 'ArrowUp') {
    rotate();
  }
}

document.addEventListener('keydown', control, { passive: false });


