import React, { useEffect } from 'react';
import { Board } from './Board';
import SidePanel from './SidePanel';
import useTetris from "../hooks/useTetris";

export function Game() {
  const tetris = useTetris();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') tetris.moveLeft();
      if (e.key === 'ArrowRight') tetris.moveRight();
      if (e.key === 'ArrowDown') tetris.softDrop();
      if (e.key === ' ') tetris.hardDrop();
      if (e.key === 'ArrowUp') tetris.rotate();
      if (e.key === 'Shift') tetris.holdPiece();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tetris]);

  return (
    <div className="grid grid-cols-[auto_auto] gap-4 p-4">
      <Board state={tetris.board} ghost={tetris.ghost} />
      <SidePanel {...tetris} />
    </div>
  );
}