
let gameBoard = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
];

let testBoard = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
];

let w; // width of canvas divided by 3
let h; // height of canvas divided by 3

let human = 'red';
let ai = 'yellow';
let currentPlayer = human;
let winner = null;

let numPlayers = 0;
let resultText;

function setup() {
  createCanvas(50*7, 50*6);
  resultText = createP('');
  w = width / 7;
  h = height / 6;
}

function mousePressed() {
  //if (currentPlayer == human) {
    // looks at where human clicked (0-6 for column #)
    let column = floor(mouseX / w);
    if (mouseY > 0 && mouseY < height && winner == null && numPlayers != 0 ) {
      dropPiece(gameBoard, column, currentPlayer);
      currentPlayer = currentPlayer == human ? ai : human;

      winner = checkForWinner(gameBoard);

      if (numPlayers == 1 && currentPlayer == ai && winner == null) {
        // computer's move
        dropPiece(gameBoard, computerMove(), ai);

        let threeInARows = checkForThreeInARows(gameBoard)
        threeInARows_ai = threeInARows[0];
        threeInARows_human = threeInARows[1];

        currentPlayer = currentPlayer == human ? ai : human;
      }

      winner = checkForWinner(gameBoard);
    }
}

function dropPiece(board, col, player) {
  // starts from bottom of column looking for open spot
  for (let i = 5; i >= 0; i--) {
    if (board[i][col] == '') {
      board[i][col] = player;
      break;
    }
  }
}

function setNumPlayers(num) {
  // sets # of players
  numPlayers = num;

  // shows reset button
  let btnReset = document.getElementById("btnReset");
  btnReset.style.display = 'inline';

  // hides # of player buttons
  let btn1Player = document.getElementById("btn1Player");
  btn1Player.style.display = 'none';
  let btn2Player = document.getElementById("btn2Player");
  btn2Player.style.display = 'none';
}

function resetGame() {
  // sets # of players to 0, so player can't play until they select a new # of players
  currentPlayer = human;
  numPlayers = 0;
  winner = null;

  // resets game board
  gameBoard = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
  ];
  loop();

  // clears out result text
  resultText.html('');

  // hides reset button
  let btnReset = document.getElementById("btnReset");
  btnReset.style.display = 'none';

  // shows # of player buttons
  let btn1Player = document.getElementById("btn1Player");
  btn1Player.style.display = 'inline';
  let btn2Player = document.getElementById("btn2Player");
  btn2Player.style.display = 'inline';
}

function draw() {
  // background of canvas
  background(255);
  // line width
  strokeWeight(4);
  // rounds ends of lines
  strokeCap(ROUND);

  // start x, start y, end x, end y
  stroke(0);
  for (let i = 1; i < 7; i++) {
    line(w*i, 5, w*i, height-5);
  }
  for (let j = 1; j < 6; j++) {
    line(5, h*j, width-5, h*j);
  }

  // draws pieces on board
  for (let j = 0;  j < 7; j++) {
    for (let i = 0; i < 6; i++) {
      let x = w * j + w / 2;
      let y = h * i + h / 2;
      let r = w / 4;

      let spot = gameBoard[i][j];

      if (spot == human) {
        fill(237, 41, 57);
        // x, y, diameter
        circle(x, y, r * 2);
      } else if (spot == ai) {
        fill(252, 209, 42);
        // x, y, diameter
        circle(x, y, r * 2);
      }
    }
  }

  if (winner != null) {
    // someone won or there was a tie
    noLoop();
    resultText.style('font-size', '32pt');
    if (winner == 'tie') {
      resultText.html('Tie!');
    } else {
      if (winner == "yellow") {
        resultText.html("Yellow won!");
      } else {
        resultText.html("Red won!");
      }
    }
  }
}
