const X_CLASS = "x";
const O_CLASS = "o";
let CPU_MODE = false;
let CPU_CHOICE;
const WINNING_COMBINATIONS = [
  [0, 1, 2, 0, -10, 0],
  [3, 4, 5, 0, 0, 0],
  [6, 7, 8, 0, 10, 0],
  [0, 3, 6, -10, 0, 90],
  [1, 4, 7, 0, 0, 90],
  [2, 5, 8, 10, 0, 90],
  [0, 4, 8, 0, 0, 45],
  [2, 4, 6, 0, 0, 135],
];

const cellElements = document.querySelectorAll("[data-cell]");
const mode_btn = document.querySelector("#mode_btn");
const board = document.getElementById("board");
const line = document.querySelector(".line");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const choiceMessageElement = document.getElementById('choiceMessage');
const resetButton = document.getElementById("resetButton");
const choiceButton = document.getElementsByClassName('choiceButton');
const xButton = document.getElementById('xButton');
const oButton = document.getElementById('oButton');

let circleTurn;

startGame();

resetButton.addEventListener("click", startGame);

const toggleMode = () => {
  CPU_MODE = !CPU_MODE;
  mode_btn.innerText = CPU_MODE ? "Multi Player Mode" : "Single Player Mode";
  startGame();
};

const CPUMove = () => {
  let found = false;
  let move;
  while (!found) {
    move = Math.floor(Math.random() * 9);
    if (!cellElements[move].classList.contains("x") && !cellElements[move].classList.contains("o")) {
      found = true;
    }
  }
  handleClickOpt(cellElements[move]);
};

xButton.addEventListener('click', () => {
  CPU_CHOICE = O_CLASS;
  choiceMessageElement.classList.remove('show');
})

oButton.addEventListener('click', () => {
    CPU_CHOICE = X_CLASS;
    CPUMove();
    choiceMessageElement.classList.remove('show');
})  

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  line.classList.remove("animate");
  winningMessageElement.classList.remove("show");
  if (CPU_MODE) {
    choiceMessageElement.classList.add('show');

 
    // try {
    //   let choice = prompt("Select Your Side").toUpperCase();
    //   if (choice === "X") {
    //     CPU_CHOICE = O_CLASS
    //   } else if (choice === "O") {
    //     CPU_CHOICE = X_CLASS
    //     CPUMove();
    //   } else {
    //     startGame();
    //   }
    // } catch (err) {
    //   console.error(err);
    //   startGame();
    // }
  }
}

const checkWin = (currentClass) => {
  const equals3 = (a, b, c) => {
    a = a.classList.contains(currentClass) ? true : false;
    b = b.classList.contains(currentClass) ? true : false;
    c = c.classList.contains(currentClass) ? true : false;
    if (a && b && c) return true;
    return false;
  };
  let isWin = false;
  WINNING_COMBINATIONS.some((win, idx) => {
    if (
      equals3(cellElements[win[0]], cellElements[win[1]], cellElements[win[2]])
    ) {
      isWin = true;
      line.classList.add("animate");
      line.style.transform = `translate(${win[3]}vmax, ${win[4]}vmax) rotate(${win[5]}deg)`;
      return true;
    }
    return false;
  });
  return isWin;
};

const handleClickOpt = (cell) => {
  const currentClass = circleTurn ? O_CLASS : X_CLASS;

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    setTimeout(() => {
      if (CPU_MODE && currentClass !== CPU_CHOICE) CPUMove();
    }, 500)
  }
};

function handleClick(e) {
  const cell = e.target;
  handleClickOpt(cell);
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`;
  }
  setTimeout(() => {
    winningMessageElement.classList.add("show");
  }, 800);
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.classList.add('animate');
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);

  if (circleTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

// function checkWin(currentClass) {
//   return WINNING_COMBINATIONS.some(combination => {
//     return combination.every(index => {
//       return cellElements[index].classList.contains(currentClass);
//     } )
//   })
// }
