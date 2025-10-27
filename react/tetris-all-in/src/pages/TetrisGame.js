import React from "react";
import useTetris from "./hooks/useTetris";
import { Board } from "./components/Board";
import { getMergedBoard } from "./utils/getMergedBoard";

export default function TetrisGame() {
  const {
    board,
    activePiece,
    position,
    ghost,
    // 他の状態（必要に応じて追加）
  } = useTetris();

  const mergedBoard = getMergedBoard(board, activePiece, position);

    // ← ここに追加！
    console.log("mergedBoard:", mergedBoard);

  return (
    <div className="flex flex-col items-center">
      <Board state={mergedBoard} ghost={ghost} />
      {/* スコアなどもここに表示できます */}
    </div>
  );
}
