let scores = {
  yellow: 1000, // ai wins
  red: -900,  // human wins, -1000
  tie: 0,
  center: 10, // 10
  twoInARow: 20,
  threeInARow: 30,
  oppTwoInARow: -15,  // -20
  oppThreeInARow: -25,  // -30
  null: 0
}

let threeInARows_human = 0;
let threeInARows_ai = 0;
let twoInARows_human = 0;
let twoInARows_ai = 0;

function computerMove() {
  let bestScore = -Infinity;
  let bestCol = Math.floor(Math.random() * 7);;

  let valid_columns = getValidCols(gameBoard);
  for (let i = 0; i < valid_columns.length; i++) {
    // copies game board into test board variable
    for (let y = 0; y < testBoard.length; y++) {
      for (let x = 0; x < testBoard[0].length; x++) {
        testBoard[y][x] = gameBoard[y][x];
      }
    }

    // tests dropping the AI's piece in column i
    dropPiece(testBoard, valid_columns[i], ai);

    // scores the move
    let score = minimax(testBoard, 0, false);
    console.log("AI " + valid_columns[i] + " - " + score);

    // updates the best score
    if (score > bestScore) {
      bestScore = score;
      bestCol = valid_columns[i];
    } else if (score == bestScore) {
      if (Math.random() > 0.5) {
        bestCol = valid_columns[i];
      }
    }
  }

  console.log(bestCol);
  return bestCol;
}

/*
 * board (2D array) - is the game game board
 * depth (int) - is how many moves out to look
 * isMaximizing (boolean) - is based on whose turn (true = ai, false = human)
*/
function minimax(board, depth, isMaximizing) {
  let result = scoreMove(board);
  if (result == "red" || result == "yellow" || depth == 4) {
    return scores[result];
  }

  if (isMaximizing) {
    // ai's turn
    let bestScore = -Infinity;
    let valid_columns = getValidCols(board);
    for (let i = 0; i < valid_columns.length; i++) {
      // tests dropping the AI's piece in column i
      let yPos = 0;
      for (let y = 5; y >= 0; y--) {
        if (board[y][valid_columns[i]] == '') {
          board[y][valid_columns[i]] = ai;
          yPos = y;
          break;
        }
      }

      // i think minus thing helps it value shorter route to get there
      let score = minimax(board, depth+1, false) - depth;
      // undos the move
      board[yPos][valid_columns[i]] = '';
      // saves the best score
      bestScore = max(score, bestScore);
    }
    return bestScore;
  } else {
    // human's turn
    let bestScore = Infinity;
    let valid_columns = getValidCols(board);
    for (let i = 0; i < valid_columns.length; i++) {
      // tests dropping the AI's piece in column i
      let yPos = 0;
      for (let y = 5; y >= 0; y--) {
        if (board[y][valid_columns[i]] == '') {
          board[y][valid_columns[i]] = human;
          yPos = y;
          break;
        }
      }

      // i think minus thing helps it value shorter route to get there
      let score = minimax(board, depth+1, true) - depth;
      // undos the move
      board[yPos][valid_columns[i]] = '';
      // saves the best score
      bestScore = min(score, bestScore);
    }
    return bestScore;
  }
}

function getValidCols(board) {
  validCols = [];
  for (let j = 0; j < board[0].length; j++) {
    if (board[0][j] == '') {
      validCols.push(j);
    }
  }
  return validCols;
}

function checkForThreeInARows(board) {
  new_threeInARows_ai = 0;
  new_threeInARows_human = 0;
  new_twoInARows_ai = 0;
  new_twoInARows_human = 0;

  // horizontal three in a row
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      if (equals3(board[i][j], board[i][j+1], board[i][j+2])) {
        if (board[i][j] == human) {
          new_threeInARows_human++;
        } else {
          new_threeInARows_ai++;
        }
      }
    }
  }

  // vertical three in a row
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 7; j++) {
      if (equals3(board[i][j], board[i+1][j], board[i+2][j])) {
        if (board[i][j] == human) {
          new_threeInARows_human++;
        } else {
          new_threeInARows_ai++;
        }
      }
    }
  }

  // diagonal three in a row
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      if (equals3(board[i][j], board[i+1][j+1], board[i+2][j+2])) {
        if (board[i][j] == human) {
          new_threeInARows_human++;
        } else {
          new_threeInARows_ai++;
        }
      }
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j < 7; j++) {
      if (equals3(board[i][j], board[i+1][j-1], board[i+2][j-2])) {
        if (board[i][j] == human) {
          new_threeInARows_human++;
        } else {
          new_threeInARows_ai++;
        }
      }
    }
  }

  return [new_threeInARows_ai, new_threeInARows_human];
}

function scoreMove(board) {
  let result = null;

  let threeInARows = checkForThreeInARows(board)
  new_threeInARows_ai = threeInARows[0];
  new_threeInARows_human = threeInARows[1];

  if (new_threeInARows_ai > threeInARows_ai) {
    result = 'threeInARow';
  }
  if (new_threeInARows_human > threeInARows_human) {
    result = 'oppThreeInARow';
  }

  // horizontal win
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      if (equals4(board[i][j], board[i][j+1], board[i][j+2], board[i][j+3])) {
        result = board[i][j];
      }
    }
  }

  // vertical win
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      if (equals4(board[i][j], board[i+1][j], board[i+2][j], board[i+3][j])) {
        result = board[i][j];
        //console.log(board);
      }
    }
  }

  // diagonal win
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (equals4(board[i][j], board[i+1][j+1], board[i+2][j+2], board[i+3][j+3])) {
        result = board[i][j];
        //console.log(board);
      }
      if (equals4(board[i][j+3], board[i+1][j+2], board[i+2][j+1], board[i+3][j])) {
        result = board[i][j+3];
        //console.log(board);
      }
    }
  }

  if (result != null) {
    return result;
  } else {
    return null;
  }
}

function checkForWinner(board) {
  let result = null;

  // checks for winner
  // horizontal win
  for (let i = 0; i < 6; i++) {
    if (equals4(board[i][0], board[i][1], board[i][2], board[i][3])) {
      result = board[i][3];
      //console.log("horizontal win: " + board[i][3]);
    }
    if (equals4(board[i][1], board[i][2], board[i][3], board[i][4])) {
      result = board[i][3];
      //console.log("horizontal win: " + board[i][3]);
    }
    if (equals4(board[i][2], board[i][3], board[i][4], board[i][5])) {
      result = board[i][3];
      //console.log("horizontal win: " + board[i][3]);
    }
    if (equals4(board[i][3], board[i][4], board[i][5], board[i][6])) {
      result = board[i][3];
      //console.log("horizontal win: " + board[i][3]);
    }
  }

  // vertical win
  for (let j = 0; j < 7; j++) {
    if (equals4(board[0][j], board[1][j], board[2][j], board[3][j])) {
      result = board[3][j];
      //console.log("vertical win: " + board[3][j]);
    }
    if (equals4(board[1][j], board[2][j], board[3][j], board[4][j])) {
      result = board[3][j];
      //console.log("vertical win: " + board[3][j]);
    }
    if (equals4(board[2][j], board[3][j], board[4][j], board[5][j])) {
      result = board[3][j];
      //console.log("vertical win: " + board[3][j]);
    }
  }

  // diagonal win
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (equals4(board[i][j], board[i+1][j+1], board[i+2][j+2], board[i+3][j+3])) {
        result = board[i][j];
        //console.log("diagonal win: " + board[i][j]);
      }
      if (equals4(board[i][j+3], board[i+1][j+2], board[i+2][j+1], board[i+3][j])) {
        result = board[i][j+3];
        //console.log("diagonal win: " + board[i][j+3]);
      }
    }
  }

  let openSpots = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  // tie
  if (result == null && openSpots == 0) {
    return 'tie';
  } else {
    return result;
  }
}

function equals4(a, b, c, d) {
  return a == b && b == c && c == d && a != '';
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function equals2(a, b) {
  return a == b && a != '';
}
