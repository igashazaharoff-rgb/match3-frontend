ts
export const findMatches = (board: number[][]) => {
  const toRemove = new Set<string>();
  const specialCells: { row: number; col: number; type: number }[] = [];

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
          if (count === 4) {
            specialCells.push({ row: i, col: j - 1, type: 6 });
          } else if (count >= 5) {
            specialCells.push({ row: i, col: j - 1, type: 7 });
          }

          for (let k = startJ; k < j; k++) {
            toRemove.add(${i},${k});
          }
        }
        count = 1;
        current = board[i][j];
        startJ = j;
      }
    }
    if (count >= 3) {
      if (count === 4) {
        specialCells.push({ row: i, col: board[i].length - 1, type: 6 });
      } else if (count >= 5) {
        specialCells.push({ row: i, col: board[i].length - 1, type: 7 });
      }

      for (let k = startJ; k < board[i].length; k++) {
        toRemove.add(${i},${k});
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
          if (count === 4) {
            specialCells.push({ row: i - 1, col: j, type: 6 });
          } else if (count >= 5) {
            specialCells.push({ row: i - 1, col: j, type: 7 });
          }

          for (let k = startI; k < i; k++) {
            toRemove.add(${k},${j});
          }
        }
        count = 1;
        current = board[i][j];
        startI = i;
      }
    }
    if (count >= 3) {
      if (count === 4) {
        specialCells.push({ row: board.length - 1, col: j, type: 6 });
      } else if (count >= 5) {
        specialCells.push({ row: board.length - 1, col: j, type: 7 });
      }for (let k = startI; k < board.length; k++) {
        toRemove.add(${k},${j});
      }
    }
  }

  return {
    toRemove: Array.from(toRemove).map(s => {
      const [r, c] = s.split(',').map(Number);
      return { row: r, col: c };
    }),
    specialCells
  };
};

export const removeMatches = (
  board: number[][],
  toRemove: { row: number; col: number }[],
  specialCells: { row: number; col: number; type: number }[]
) => {
  const newBoard = JSON.parse(JSON.stringify(board));

  for (const { row, col } of toRemove) {
    newBoard[row][col] = -1;
  }

  for (const { row, col, type } of specialCells) {
    if (type === 6) { // Взрывная
      for (let i = Math.max(0, row - 1); i <= Math.min(board.length - 1, row + 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(board[0].length - 1, col + 1); j++) {
          newBoard[i][j] = -1;
        }
      }
    } else if (type === 7) { // Радужная
      const colorToRemove = board[row][col];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
          if (newBoard[i][j] === colorToRemove) {
            newBoard[i][j] = -1;
          }
        }
      }
    }
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
