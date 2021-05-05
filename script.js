//Canvas Variables
let canv, ctx;

//Canvas Dimensions
let w, h;

//Board Properties
let board = [];

//Load script on startup
window.onload = function() {
	canv=document.getElementById("board");
	ctx=canv.getContext("2d");
    canv.width = 400;
    canv.height = 400;
    w = canv.width;
    h = canv.height;
	//document.addMouseListener("mouseclick", mouseClick);
}

//Draw the Board
function drawBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            ctx.fillStyle = "gray";
            ctx.fillRect(j * (w/board[i].length), i * (h/board.length), w/board[i].length, h/board.length);
            ctx.strokeRect(j * (w/board[i].length), i * (h/board.length), w/board[i].length, h/board.length);
        }
    }
}

function newGame() {

    //Board Dimensions
    let xSquares = 10;
    let ySquares = 10;

    createEmptyBoard(xSquares, ySquares);

    //Empty Board Check
    printBoard();

    //Bomb Initialization
    let bombs = createBombs();

    //Create Board
    for (let i = 0; i < xSquares; i++) {
        for (let j = 0; j < ySquares; j++) {
            for (let k = 0; k < bombs.length; k++) {
                if (bombs[k].x == i && bombs[k].y == j) {
                    board[j][i] = 9;
                    incrementNumbers(i, j);
                }
            }
        }
    }

    //Completed Board Check
    printBoard();
    
}

function createEmptyBoard(xSquares, ySquares) {
    
    for (let i = 0; i < xSquares; i++) {
        for (let j = 0; j < ySquares; j++) {
            board[j][i] = 0;
        }
    }

}

function createBombs() {

    //Bomb Properties
    let bombs = [];
    let numBombs = 8;

    for (let i = 0; i < numBombs; i++) {

        let openSpace = true;
        let xPos = Math.floor(Math.random() * board[0].length);
        let yPos = Math.floor(Math.random() * board.length);

        for (let j = 0; j < i; j++) {
            if (xPos == bombs[j].x && yPos == bombs[j].y) {
                openSpace = false;
            }
        }

        if (openSpace) {
            bombs[i] = {
                x: xPos,
                y: yPos
            };
        } else {
            i--;
        }

    }

    return bombs;
}

function incrementNumbers(x, y) {

    //Loop Through Adjacent Blocks
    for (let i = (x-1); i <= (x+1); i++) {
        for (let j = (y-1); j <= (y+1); j++) {
            if ((i != x && j != y) && (i >= 0 && i <= board[0].length) && (j >= 0 && j <= board.length)) {
                board[j][i]++;
            }
        }
    }

}

/*Debugging Functions*/

function printBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            console.log(board[i][j] + " ");
        }
        console.log("\n");
    }
}