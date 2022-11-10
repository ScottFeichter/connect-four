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
  // todo: address full stack
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

function checkForWin(height = HEIGHT, width = WIDTH) {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    // TODO: Check four cells to see if they're all legal & all color of current
    // player

    // check for max cells
    // const last = cells.length - 1;
    // const maped = cells.map((x) => x[1]);
    const widthCheckMax = Math.max(...cells.map((x) => x[1]));
    const widthMaxCheck = widthCheckMax + 3 <= width;

    // const widthCheckMin = cells[last][1];
    const widthCheckMin = Math.min(...cells.map((x) => x[1]));
    const widthMinCheck = widthCheckMin - 3 <= width;

    const heightCheckMax = Math.max(...cells.map((x) => x[0]));
    const heightMaxCheck = heightCheckMax + 3 <= width;

    const heightCheckMin = Math.min(...cells.map((x) => x[0]));
    const heightMinCheck = heightCheckMin - 3 <= width;

    if (widthMaxCheck && widthMinCheck && heightMaxCheck && heightMinCheck) {
      let foundCells = [];
      for (let index = 0; index < cells.length; index++) {
        const combo = cells[index];
        const cell = document.getElementById(`c-${combo[0]},${combo[1]}`);
        if (cell !== undefined) {
          foundCells.push(cell);
        }
      }

      let colors = [];
      for (const cell of foundCells) {
        if (cell?.children.length > 0) {
          let firstchild = cell.children[0];
          if (firstchild.className.includes("p" + currPlayer)) {
            console.log("has color");
          }
        }
      }

      let colorsAccurate = false;
      if (colors.length === 4) {
        colors.every((x) => x === true);
      }

      /* const colorsAccurate = foundCells.every((x) =>
        x.children.className.includes('p' + currPlayer)
      ); */

      return colorsAccurate;
    }
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
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
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDL = [
        [y, x],
        [y - 1, x - 1],
        [y - 2, x - 2],
        [y - 3, x - 3],
      ];
      let diagDR = [
        [y, x],
        [y - 1, x + 1],
        [y - 2, x + 2],
        [y - 3, x + 3],
      ];

      // find winner (only checking each win-possibility as needed)
      let horizWin = _win(horiz);
      let vertWin = _win(vert);
      let diagDRWin = _win(diagDR);
      let diagDLWin = _win(diagDL);

      if (horizWin || vertWin || diagDRWin || diagDLWin) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
