class SudokuSolver {
  constructor() {
    this.rowSet = new Map();
    this.colSet = new Map();
    this.rcSet = new Map();
    this.red = new Set();
    this.board = [];

    for (let r = 0; r < 9; r++) {
      this.board[r] = [];
      for (let c = 0; c < 9; c++) {
        this.board[r][c] = "";
      }
    }
  }

  isAvail(row, col, value) {
    if (!this.rowSet.has(row)) {
      this.rowSet.set(row, new Set());
    }

    if (!this.colSet.has(col)) {
      this.colSet.set(col, new Set());
    }

    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    if (!this.rcSet.has(rcKey)) {
      this.rcSet.set(rcKey, new Set());
    }
    return (
      !this.rowSet.get(row).has(value) &&
      !this.colSet.get(col).has(value) &&
      !this.rcSet
        .get(`${Math.floor(row / 3)}-${Math.floor(col / 3)}`)
        .has(value)
    );
  }

  addValue(row, col, value) {
    if (!this.rowSet.has(row)) {
      this.rowSet.set(row, new Set());
    }
    this.rowSet.get(row).add(value);

    if (!this.colSet.has(col)) {
      this.colSet.set(col, new Set());
    }
    this.colSet.get(col).add(value);

    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    if (!this.rcSet.has(rcKey)) {
      this.rcSet.set(rcKey, new Set());
    }
    this.rcSet.get(rcKey).add(value);
  }
  removeValue(row, col, value) {
    this.rowSet.get(row).delete(value);
    this.colSet.get(col).delete(value);
    const rcKey = `${Math.floor(row / 3)}-${Math.floor(col / 3)}`;
    this.rcSet.get(rcKey).delete(value);
  }

  dfs(row, col) {
    if (row === this.board.length) {
      return true;
    }
    if (col === this.board[0].length) {
      return this.dfs(row + 1, 0);
    }
    if (this.board[row][col] === "") {
      for (let i = 1; i <= 9; i++) {
        const strI = i.toString();
        if (this.isAvail(row, col, strI)) {
          this.addValue(row, col, strI);
          this.board[row][col] = strI;
          if (this.dfs(row, col + 1)) {
            return true;
          }
          this.removeValue(row, col, strI);
          this.board[row][col] = "";
        }
      }
    } else {
      return this.dfs(row, col + 1);
    }
  }

  read(first_button, second_button) {
    const [r, c] = first_button.substring(5).split("-").map(Number);
    const val = this.board[r][c];
    const button = document.getElementById(second_button);
    const buttonValue = button.value;
    if (!this.isAvail(r, c, buttonValue)) {
      alert("Check the value you entered!");
      return;
    }
    this.board[r][c] = buttonValue;
    this.addValue(r, c, buttonValue);
    const myButton = document.getElementById(first_button);
    myButton.value = this.board[r][c];

    if (buttonValue !== "") {
      myButton.style.backgroundColor = "lightgray";
    } else {
      this.removeValue(r, c, val);
      myButton.style.backgroundColor = null;
    }
  }

  show() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const buttonId = `text-${r}-${c}`;
        const myButton = document.getElementById(buttonId);
        myButton.value = this.board[r][c];
      }
    }
  }

  ready() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const buttonId = `text-${r}-${c}`;
        const myButton = document.getElementById(buttonId);
        console.log(myButton.value);
        if (myButton.value !== ""){
          this.board[r][c] = myButton.value;
          myButton.style.backgroundColor = "lightgray";
          this.addValue(r, c, this.board[r][c]);
        }
      }
    }
  }
}



const solver = new SudokuSolver();
function solve() {
  solver.ready();
  solver.dfs(0, 0);
  solver.show();
}

function startOver() {
  location.reload();
}

let clickCount = 0;
let firstElementId = null;
let secondElementId = null;

function handleClick(button) {
  const clickedElementId = button.id;
  if (clickCount === 0 && button.type === "text") {
    firstElementId = clickedElementId;
    clickCount++;
  } else if (clickCount === 1 && button.type === "button") {
    secondElementId = clickedElementId;
    clickCount = 0;
    solver.read(firstElementId, secondElementId);
  } else {
    firstElementId = clickedElementId;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("solve").addEventListener("click", solve);
  document.getElementById("startOver").addEventListener("click", startOver);

  const first_button = document.querySelectorAll("input[type='text']");
  first_button.forEach((button) => {
    button.addEventListener("click", () => handleClick(button));
  });

  const second_button = document.querySelectorAll("input[type='button']");
  second_button.forEach((button) => {
    button.addEventListener("click", () => handleClick(button));
  });
});
