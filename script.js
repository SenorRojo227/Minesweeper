//Canvas Variables
let canv, ctx;

//Canvas Dimensions
let w, h;
const squareSize = 40;

//Board Properties
let board, difficulty, theme;

//Resources
let flag, bomb, forks, vampires = [];

//Load script on startup
window.onload = function() {
	canv=document.getElementById("board");
	ctx=canv.getContext("2d");
    setDifficulty("Medium");
    initImages();
	canv.addEventListener('click', mouseClick);
    canv.addEventListener('contextmenu', rightClick, false);
}

function initImages() {

    //Initialize Images
    bomb = new Image(squareSize, squareSize);
    flag = new Image(squareSize, squareSize);
    for (let i = 0; i < 1; i++) {
        vampires[i] = new Image(squareSize, squareSize);
    }

    //Add Sources
    bomb.src = "resources/Bomb.png";
    flag.src = "resources/Flag.png";
    vampires[0].src = "resources/twilight/Carlisle.png";
}

//Draw the Board
function drawBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {

            if (board[i][j].hidden) {
                if (theme == "Twilight") {
                    ctx.fillStyle = "#FF0000";
                } else {
                    ctx.fillStyle = "gray";
                }
            } else {
                ctx.fillStyle = getSquareColor(board[i][j].value);
            }

            ctx.fillRect(j * (w/board[0].length), i * (h/board.length), w/board[0].length, h/board.length);
            ctx.strokeRect(j * (w/board[0].length), i * (h/board.length), w/board[0].length, h/board.length);

            //Draw Revealed Squares
            if (!board[i][j].hidden) {
                if (board[i][j].value == 9) {
                    ctx.drawImage(bomb, j * (w/board[0].length), i * (h/board.length), bomb.width, bomb.height);
                } else {
                    ctx.strokeText("" + board[i][j].value, j * (w/board[0].length) + (w/board[0].length/2), i * (h/board.length) + (h/board.length/2));
                }
            }

            //Draw Flags
            if (board[i][j].flag) {
                if (theme == "Twilight") {
                    ctx.drawImage(vampires[0], j * (w/board[0].length), i * (h/board.length), flag.width, flag.height);
                } else {
                    ctx.drawImage(flag, j * (w/board[0].length), i * (h/board.length), flag.width, flag.height);
                }
            }

        }
    }
}

function newGame() {

    board = [[]];

    //Board Dimensions
    difficulty = document.getElementById("difficulty").innerHTML;
    theme = document.getElementById("theme").innerHTML;
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
    drawBoard(theme);

    //printSize();

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
                hidden: true,
                flag: false
            };
        }
    }

}

function createBombs() {

    //Bomb Properties
    let bombs = [];
    let numBombs;
    
    switch(difficulty) {
        case "Easy":
            numBombs = 5;
            break;
        case "Medium":
            numBombs = 12;
            break;
        case "Hard":
            numBombs = 20;
            break;
    }

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
        board[y][x].flag = false;
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
                board[j][i].flag = false;
            }
        }
    }

    drawBoard();

}

function getSquareColor(value) {

    switch(value) {
        case 0:
            return "#FFF";
            break;
        case 1:
            return "#FDD";
            break;
        case 2:
            return "#FBB";
            break;
        case 3:
            return "#F99";
            break;
        case 4:
            return "#F88";
            break;
        case 5:
            return "#F77";
            break;
        case 6:
            return "#F66";
            break;
        case 7:
            return "#F55";
            break;
        case 8:
            return "#F44";
            break;
        
    }

    return "#FFF";

}

/*On-Click Functions*/

function mouseClick(e) {
    x = e.clientX - 50;
    y = e.clientY - 84;

    xSquare = Math.floor(x / (w/board[0].length));
    ySquare = Math.floor(y / (h/board.length));

    showSquare(xSquare, ySquare);
    
}

function rightClick(e) {

    e.preventDefault();
    
    x = e.clientX - 50;
    y = e.clientY - 84;

    xSquare = Math.floor(x / (w/board[0].length));
    ySquare = Math.floor(y / (h/board.length));

    if (board[ySquare][xSquare].hidden) {
        board[ySquare][xSquare].flag = !board[ySquare][xSquare].flag;
        console.log("Alert!");
    }

    drawBoard();

    return false;
}

function setDifficulty(d) {

    document.getElementById("difficulty").innerHTML = d;
    difficulty = d;

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

function setTheme(t) {
    
    document.getElementById("theme").innerHTML = t;
    theme = t;
    
    switch(theme) {
        case "Normal":
            canv.style.backgroundImage = "none";
        case "Twilight":
            canv.style.backgroundImage = "url(resources/twilight/Forks-Background.jpg)";
            break;
    }

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

function printSize() {
    console.log("y Length: " + board.length + ", x Length: " + board[0].length);
}