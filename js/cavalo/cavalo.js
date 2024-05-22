const BOARD_SIZE = 8;
let board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
let delay = 500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidMove(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === 0;
}

async function solveKnightTour(x, y, moveCount) {
  if (moveCount === BOARD_SIZE * BOARD_SIZE) {
    return true;
  }

  const moves = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1]
  ];

  for (const [dx, dy] of moves) {
    const newX = x + dx;
    const newY = y + dy;

    if (isValidMove(newX, newY)) {
      board[newX][newY] = moveCount + 1;
      updateBoard();
      await sleep(delay);
      if (await solveKnightTour(newX, newY, moveCount + 1)) {
        return true;
      }
      board[newX][newY] = 0;
      updateBoard();
      await sleep(delay);
    }
  }

  return false;
}

function updateBoard() {
  const chessboard = document.getElementById('chessboard');
  chessboard.innerHTML = '';
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement('td');
      cell.className = (i + j) % 2 === 0 ? 'white' : 'black';
      if (board[i][j] !== 0) {
        cell.textContent = board[i][j];
        cell.classList.add('visited');
      }
      row.appendChild(cell);
    }
    chessboard.appendChild(row);
  }
}

function startSolving() {
  delay = parseInt(document.getElementById('delay').value);
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  board[0][0] = 1;  // Starting position
  solveKnightTour(0, 0, 1).then(result => {
    if (result) {
      alert('Solução encontrada!');
    } else {
      alert('Nenhuma solução encontrada.');
    }
  });
}

updateBoard();