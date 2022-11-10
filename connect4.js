"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let htmlBoard = document.getElementById("board");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(width = WIDTH, height = HEIGHT) {
  // columns
  for (let columnIndex = 0; columnIndex < height; columnIndex++) {
    let boardRow = [];
    //rows
    for (let rowIndex = 0; rowIndex < width; rowIndex++) {
      boardRow.push(null);
    }
    board.push(boardRow);
  }

  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard(width = WIDTH, height = HEIGHT) {
  // creates top row clickers
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // creates head cell
  for (let headCellIndex = 0; headCellIndex < width; headCellIndex++) {
    let headCell = document.createElement("td");
    headCell.id = `headCell ${headCellIndex}`;
    // headCell.setAttribute("id", headCell);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    row.className = "tableRow";

    for (let x = 0; x < width; x++) {
      let cell = document.createElement("td");
      cell.className = "tableCell";
      cell.id = `c-${y},${x}`;
      row.appendChild(cell);
    }

    htmlBoard.appendChild(row);
  }
}

function findNextOpenCell(columnCells) {
  let emptyCell = undefined;
  for (let index = 0; index < columnCells.length; index++) {
    const cell = columnCells[index];
    if (cell.children.length > 0 && index !== 0) {
      emptyCell = columnCells[index - 1];
      return emptyCell;
    } else if (cell.children.length === 0 && index === columnCells.length - 1) {
      emptyCell = columnCells[index];
    }
  }
  return emptyCell;
}

function getColumnCels(col) {
  let colNumber = col.id.split(" ")[1];

  // find all cells with x value of 6
  // get parent
  const colParent = col.parentElement.parentElement;
  // get all table rows in parent
  const tableRows = colParent.getElementsByClassName("tableRow");
  let columnCells = [];
  for (const row of Array.from(tableRows)) {
    const rowCells = row.children;
    for (const cell of rowCells) {
      const splits = cell.id.split(",");
      if (splits[1] === colNumber) {
        columnCells.push(cell);
      }
    }
  }

  return columnCells;
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(targetId) {
  // TODO: write the real version of this, rather than always returning 5

  // get contents of target id
  const col = document.getElementById(targetId);

  const colCellStack = getColumnCels(col);
  // find lowest value for those. (math.floor)
  // return that value
  let nextAvailableCell = findNextOpenCell(colCellStack);

  if (nextAvailableCell !== undefined) {
    const regex = /(?!-)[0-9](?=,)/;
    const cellYValue = nextAvailableCell.id.match(regex)[0];
    return cellYValue;
  } else {
    // todo: alert user they cant add any more spots in here.
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let tableCellDiv = document.createElement("div");
  tableCellDiv.className = `piece p${currPlayer}`;
  // tableCellDiv.className = "p1";
  let cellPosition = document.getElementById(`c-${y},${x}`);
  cellPosition.appendChild(tableCellDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
}

/** checks for if entire board is filled  */
function isEntireBoardFilled(board) {
  const boardfull = board.every((x) => x.every((y) => y !== null));
  return boardfull;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell

  const targetId = evt.target.id; // todo: check this id. is it supposed to be a number?
  let splits = targetId.split(" ");
  const xValue = splits[1];

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(targetId);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, xValue);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // // TODO: check if all cells in board are filled; if so call, call endGame

  if (isEntireBoardFilled(board)) {
    return endGame("its a tie! Play again!"); // todo: its a tie!
  }

  // switch players
  // // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    // TODO: Check four cells to see if they're all legal & all color of current
    // player
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert;
      let diagDL;
      let diagDR;

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
