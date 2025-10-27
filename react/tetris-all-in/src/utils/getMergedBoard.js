export function getMergedBoard(board, piece, position) {
  const newBoard = board.map(row => [...row]); // ボードをコピー

  if (!piece) return newBoard;

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = y + position.y;
        const boardX = x + position.x;

        if (
          boardY >= 0 &&
          boardY < newBoard.length &&
          boardX >= 0 &&
          boardX < newBoard[0].length
        ) {
          newBoard[boardY][boardX] = piece.shape[y][x];
        }
      }
    }
  }

  return newBoard;
}
