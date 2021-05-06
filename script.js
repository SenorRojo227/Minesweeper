//Canvas Variables
let canv, ctx;

//Canvas Dimensions
let w, h;

//Board Properties
let board = [[]];

//Load script on startup
window.onload = function() {
	canv=document.getElementById("board");
	ctx=canv.getContext("2d");
    setDifficulty("Medium");
	canv.addEventListener('click', mouseClick);
}

//Draw the Board
function drawBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {

            if (board[j][i].hidden) {
                ctx.fillStyle = "gray";
            } else {
                ctx.fillStyle = "white";
            }

            ctx.fillRect(i * (w/board[0].length), j * (h/board.length), w/board[0].length, h/board.length);
            ctx.strokeRect(i * (w/board[0].length), j * (h/board.length), w/board[0].length, h/board.length);

            if (!board[j][i].hidden) {
                ctx.strokeText("" + board[j][i].value, i * (w/board[0].length) + (w/board[0].length/2), j * (h/board.length) + (h/board.length/2));
            }
        }
    }
}

function newGame() {

    //Board Dimensions
    let difficulty = document.getElementById("difficulty").innerHTML;
    let xSquares;
    let ySquares;

    switch(difficulty) {
        case "Easy":
            xSquares = 5;
            ySquares = 5;
            break;
        case "Medium":
            xSquares = 10;
            ySquares = 10;
            break;
        case "Hard":
            xSquares = 20;
            ySquares = 12;
            break;
    }

    //Board Initialization
    createEmptyBoard(xSquares, ySquares);
    drawBoard();

    console.log("y Length: " + board.length + ", x Length: " + board[0].length);

    //Bomb Initialization
    let bombs = createBombs();

    //Create Board
    for (let i = 0; i < xSquares; i++) {
        for (let j = 0; j < ySquares; j++) {
            for (let k = 0; k < bombs.length; k++) {
                if (bombs[k].x == i && bombs[k].y == j) {
                    board[j][i].value = 9;
                    incrementNumbers(i, j);
                }
            }
        }
    }

    //printBoard();
    
}

function createEmptyBoard(xSquares, ySquares) {
    
    for (let i = 0; i < ySquares; i++) {
        board[i] = [];
        for (let j = 0; j < xSquares; j++) {
            board[i][j] = {
                value: 0,
                hidden: true
            };
        }
    }

}

function createBombs() {

    //Bomb Properties
    let bombs = [];
    let numBombs = 16;

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

    //Loop Through Adjacent Spaces
    for (let i = (x-1); i <= (x+1); i++) {
        for (let j = (y-1); j <= (y+1); j++) {

            //Check Boundaries
            if ((i >= 0 && i < board[0].length) && (j >= 0 && j < board.length)) {

                //Skip Current Space
                if (!(i == x && j == y)) {

                    //Check if Bomb Exists
                    if (board[j][i].value != 9) {
                        board[j][i].value++;
                    }

                }
            }
        }
    }
}

function showSquare(x, y) {

    console.log("x: " + x + ",y: " + y);

    if (board[y][x].value != 9) {

        board[y][x].hidden = false;
        if (board[y][x].value == 0) {
            
            //Loop Through Adjacent Spaces
            for (let i = (x-1); i <= (x+1); i++) {
                for (let j = (y-1); j <= (y+1); j++) {

                    //Check Boundaries
                    if ((i >= 0 && i < board[0].length) && (j >= 0 && j < board.length)) {

                        //Skip Current and Hidden Spaces
                        if (!(i == x && j == y) && board[j][i].hidden == true) {
                            showSquare(i, j);
                        }

                    }
                }
            }
        }
    } else {
        
        //Lose Game
        for (let i = 0; i < board[0].length; i++) {
            for (let j = 0; j < board.length; j++) {
                board[j][i].hidden = false;
            }
        }
    }

    drawBoard();

}

/*On-Click Functions*/

function mouseClick(e) {
    x = e.clientX - 50;
    y = e.clientY - 70;

    xSquare = Math.floor(x / (w/board[0].length));
    ySquare = Math.floor(y / (h/board.length));

    showSquare(xSquare, ySquare);
    
}

function setDifficulty(difficulty) {
    document.getElementById("difficulty").innerHTML = difficulty;
	canv=document.getElementById("board");

    switch(difficulty) {
        case "Easy":
            canv.style.width = "200px";
            canv.style.height = "200px";
            canv.width = 200;
            canv.height = 200;
            break;
        case "Medium":
            canv.style.width = "400px";
            canv.style.height = "400px";
            canv.width = 400;
            canv.height = 400;
            break;
        case "Hard":
            canv.style.width = "800px";
            canv.style.height = "480px";
            canv.width = 800;
            canv.height = 480;
            break;
    }

    w = canv.width;
    h = canv.height;
}

/*Debugging Functions*/

function printBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            console.log(board[i][j].value + " ");
        }
        console.log("\n");
    }
}