const n = 8;
const board = Array.from({ length: n }, () => Array(n).fill(0));
let delay = 500;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isSafe(board, row, col) {
    for (let i = 0; i < col; i++) {
        if (board[row][i] === 1) return false;
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
    }
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
        if (board[i][j] === 1) return false;
    }
    return true;
}

async function solveNQueens(board, col) {
    if (col >= n) return true;

    for (let i = 0; i < n; i++) {
        board[i][col] = 2; // Mark as tested
        updateBoard();
        await sleep(delay);
        if (isSafe(board, i, col)) {
            board[i][col] = 1;
            updateBoard();
            await sleep(delay);
            if (await solveNQueens(board, col + 1)) return true;
            board[i][col] = 0; // Backtrack
            updateBoard();
            await sleep(delay);
        }
        board[i][col] = 0; // Reset tested
        updateBoard();
    }
    return false;
}

function updateBoard() {
    const chessboard = document.getElementById("chessboard");
    chessboard.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            cell.className = (i + j) % 2 === 0 ? "white" : "black";
            if (board[i][j] === 1) {
                cell.textContent = "Q";
                cell.classList.add("queen");
            } else if (board[i][j] === 2) {
                cell.classList.add("tested");
            }
            row.appendChild(cell);
        }
        chessboard.appendChild(row);
    }
}

function startSolving() {
    delay = document.getElementById("delay").value;
    solveNQueens(board, 0).then(result => {
        if (result) {
            alert("Solução encontrada!");
        } else {
            alert("Nenhuma solução encontrada.");
        }
    });
}

updateBoard();
