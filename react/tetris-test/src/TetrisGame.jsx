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
    score,
    gameOver,
  } = useTetris();

  const mergedBoard = getMergedBoard(board, activePiece, position);

  return (
    <div className="flex flex-col items-center">
      <Board state={mergedBoard} ghost={ghost} />
      <div className="text-white mt-4">
        <h1>Score: {score}</h1>
        {gameOver && <h2>Game Over</h2>}
      </div>
    </div>
  );
}
