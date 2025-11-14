
// 4x4 board size
const size = 4;
let steps = 0;
// Generate numbers 1-15 and 0
let board = [];
for (let i = 0; i < size * size; i++) {
    board.push(i);
}

function shuffleBoard() {
    do {
        // Shuffle
        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
    } while (!isSolvable(board));
}

function isSolvable(arr) {
    let inv = 0;

    // Count inversions
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > 0 && arr[j] > 0 && arr[i] > arr[j]) inv++;
        }
    }

    // Find the blank tile,
    // and calculate its row from the bottom while bottom row = 1
    const blank = arr.indexOf(0);
    const blankRow = size - Math.floor(blank / size);

    return (inv + blankRow) % 2 === 1;
}

// Check if puzzle is solved
function isFinished() {
    for (let i = 0; i < 15; i++) {
        if (board[i] !== i + 1) return false;
    }
    return true;
}

// Attempt to move a tile (only if adjacent to empty tile)
function tryMove(index) {
    const blank = board.indexOf(0);

    const validMoves = [];

    // Check adjacency
    if (index - size === blank) validMoves.push(blank);
    if (index + size === blank) validMoves.push(blank);
    if (index % size !== 0 && index - 1 === blank) validMoves.push(blank);
    if (index % size !== size - 1 && index + 1 === blank) validMoves.push(blank);

    if (validMoves.length > 0) {
        [board[index], board[blank]] = [board[blank], board[index]];
        steps++;
        render();
    }
}

// Board DOM
const boardDiv = document.getElementById("board");

// Render the board
function render() {
    boardDiv.innerHTML = "";

    board.forEach((num, index) => {
        const div = document.createElement("div");
        div.classList.add("tile");

        if (num > 0) {
            div.innerText = num;
            div.onclick = () => tryMove(index);
        } else {
            div.classList.add("empty");
        }

        boardDiv.appendChild(div);
    });

    if (isFinished()) {
        setTimeout(() => {
            document.getElementById("winSteps").innerText = steps;
            document.getElementById("winPopup").classList.add("show");
        }, 200);
    }
    document.getElementById("Counter").innerText = "Steps: " + steps;
}

document.getElementById("restartBtn1").onclick = restartGame;
document.getElementById("restartBtn2").onclick = restartGame;

function restartGame() {
    shuffleBoard();
    steps = 0;
    document.getElementById("Counter").innerText = "Steps: 0";
    document.getElementById("winPopup").classList.remove("show");
    render();
}

// Initialize the game
shuffleBoard();
steps = 0;
render();
