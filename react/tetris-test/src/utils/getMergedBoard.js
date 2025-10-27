// utils/getMergedBoard.js

export function getMergedBoard(board, piece, position) {
  // 新しいボードをコピー（元のボードを変更しない）
  const newBoard = board.map(row => [...row]);

  // ピースが存在しない場合は、元のボードをそのまま返す
  if (!piece) return newBoard;

  // ピースをボードにマージ
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = y + position.y; // ボード上のY位置
        const boardX = x + position.x; // ボード上のX位置

        // ボードの範囲内であれば、ピースの値をボードに設定
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
