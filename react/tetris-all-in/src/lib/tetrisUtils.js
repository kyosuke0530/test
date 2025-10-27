const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [2, 2],
    [2, 2],
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
};

export function generateBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));}

export function getRandomPiece() {
  const keys = Object.keys(SHAPES);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return {
    shape: SHAPES[rand],
    type: rand,
  };
}

export function rotateMatrix(matrix) {
  const size = matrix.length;
  const result = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[x][size - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

export function checkCollision(board, piece, pos) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newY = y + pos.y;
        const newX = x + pos.x;
        if (
          newY >= board.length ||
          newX < 0 ||
          newX >= board[0].length ||
          board[newY]?.[newX]
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePiece(board, piece, pos) {
  const newBoard = board.map(row => [...row]);
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        newBoard[y + pos.y][x + pos.x] = piece[y][x];
      }
    }
  }
  return newBoard;
}

export function clearLines(board) {
  const newBoard = board.filter(row => row.some(cell => !cell));
  const cleared = board.length - newBoard.length;
  while (newBoard.length < 20) {
    newBoard.unshift(Array(10).fill(null));
  }
  return [newBoard, cleared];
}

export function getGhost(board, piece, pos) {
  let y = pos.y;
  while (!checkCollision(board, piece, { x: pos.x, y: y + 1 })) {
    y++;
  }
  const ghostBoard = Array.from({ length: 20 }, () => Array(10).fill(null));
  for (let py = 0; py < piece.length; py++) {
    for (let px = 0; px < piece[py].length; px++) {
      if (piece[py][px]) {
        const gy = y + py;
        const gx = pos.x + px;
        if (gy >= 0 && gy < 20 && gx >= 0 && gx < 10) {
          ghostBoard[gy][gx] = true;
        }
      }
    }
  }
  return ghostBoard;
}