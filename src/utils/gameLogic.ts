// frontend/src/utils/gameLogic.ts

export const findMatches = (board: number[][]) => {
  const toRemove = new Set<string>();

  // Проверка горизонтальных совпадений
  for (let i = 0; i < board.length; i++) {
    let count = 1;
    let current = board[i][0];
    let startJ = 0;

    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j] === current && current !== -1) {
        count++;
      } else {
        if (count >= 3) {
          for (let k = startJ; k < j; k++) {
            toRemove.add(`${i},${k}`); // ✅ Вот тут
          }
        }
        count = 1;
        current = board[i][j];
        startJ = j;
      }
    }
    if (count >= 3) {
      for (let k = startJ; k < board[i].length; k++) {
        toRemove.add(`${i},${k}`); // ✅ И тут
      }
    }
  }

  // Проверка вертикальных совпадений
  for (let j = 0; j < board[0].length; j++) {
    let count = 1;
    let current = board[0][j];
    let startI = 0;

    for (let i = 1; i < board.length; i++) {
      if (board[i][j] === current && current !== -1) {
        count++;
      } else {
        if (count >= 3) {
          for (let k = startI; k < i; k++) {
            toRemove.add(`${k},${j}`); // ✅ И тут
          }
        }
        count = 1;
        current = board[i][j];
        startI = i;
      }
    }
    if (count >= 3) {
      for (let k = startI; k < board.length; k++) {
        toRemove.add(`${k},${j}`); // ✅ И тут
      }
    }
  }

  return Array.from(toRemove).map(s => {
    const [r, c] = s.split(',').map(Number);
    return { row: r, col: c };
  });
};

export const removeMatches = (board: number[][], matches: { row: number; col: number }[]) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (const { row, col } of matches) {
    newBoard[row][col] = -1;
  }
  return newBoard;
};

export const dropPieces = (board: number[][]) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let j = 0; j < board[0].length; j++) {
    let writeIndex = board.length - 1;
    for (let i = board.length - 1; i >= 0; i--) {
      if (newBoard[i][j] !== -1) {
        newBoard[writeIndex][j] = newBoard[i][j];
        if (writeIndex !== i) {
          newBoard[i][j] = -1;
        }
        writeIndex--;
      }
    }
    for (let i = writeIndex; i >= 0; i--) {
      newBoard[i][j] = Math.floor(Math.random() * 6);
    }
  }
  return newBoard;
};
