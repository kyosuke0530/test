import { useEffect, useState, useCallback } from "react";
import {
  generateBoard,
  getRandomPiece,
  rotateMatrix,
  checkCollision,
  mergePiece,
  clearLines,
  getGhost,
} from "../lib/tetrisUtils";

const LEVEL_SPEED = [1000, 800, 600, 400, 300, 200, 100, 80, 60, 50];

export default function useTetris() {
  const [board, setBoard] = useState(generateBoard());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [activePiece, setActivePiece] = useState(getRandomPiece());
  const [nextQueue, setNextQueue] = useState([getRandomPiece(), getRandomPiece(), getRandomPiece()]);
  const [holdPiece, setHoldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 落下処理と衝突処理
const movePiece = useCallback((dx, dy) => {
  console.log('movePiece', dx, dy); // デバッグログを追加
  if (!activePiece || gameOver) return;

  const newPos = { x: position.x + dx, y: position.y + dy };
  console.log('newPos:', newPos); // 新しい位置を確認
  if (!checkCollision(board, activePiece.shape, newPos)) {
    setPosition(newPos);
  } else if (dy === 1) {
    const newBoard = mergePiece(board, activePiece.shape, position);
    const [clearedBoard, clearedLines] = clearLines(newBoard);
    setBoard(clearedBoard);
    if (clearedLines > 0) {
      setLines((prev) => prev + clearedLines);
      setScore((prev) => prev + clearedLines * 100);
      setLevel((prev) => Math.floor((lines + clearedLines) / 10));
    }
    const newQueue = [...nextQueue];
    const next = newQueue.shift();
    setActivePiece(next);
    setNextQueue([...newQueue, getRandomPiece()]);
    setPosition({ x: 3, y: 0 });
    setCanHold(true);
    if (checkCollision(clearedBoard, next.shape, { x: 3, y: 0 })) {
      setGameOver(true);
    }
  }
}, [board, activePiece, position, nextQueue, lines, gameOver]);


  const rotate = useCallback(() => {
    if (!activePiece || gameOver) return;
    const rotated = rotateMatrix(activePiece.shape);
    if (!checkCollision(board, rotated, position)) {
      setActivePiece({ ...activePiece, shape: rotated });
    }
  }, [activePiece, board, position, gameOver]);

  const hardDrop = useCallback(() => {
    if (!activePiece || gameOver) return;
    let y = position.y;
    while (!checkCollision(board, activePiece.shape, { x: position.x, y: y + 1 })) {
      y++;
    }
    setPosition({ x: position.x, y });
    movePiece(0, 1); // 衝突処理の実行
  }, [activePiece, board, position, movePiece, gameOver]);

  const hold = useCallback(() => {
    if (!canHold || !activePiece || gameOver) return;
    setCanHold(false);
    if (holdPiece) {
      const temp = holdPiece;
      setHoldPiece(activePiece);
      setActivePiece(temp);
      setPosition({ x: 3, y: 0 });
    } else {
      setHoldPiece(activePiece);
      const newQueue = [...nextQueue];
      const next = newQueue.shift();
      setActivePiece(next);
      setNextQueue([...newQueue, getRandomPiece()]);
      setPosition({ x: 3, y: 0 });
    }
  }, [activePiece, holdPiece, canHold, nextQueue, gameOver]);

  const ghost = activePiece ? getGhost(board, activePiece.shape, position) : null;

  // 自動落下処理
  useEffect(() => {
    if (!activePiece || gameOver) return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, LEVEL_SPEED[Math.min(level, LEVEL_SPEED.length - 1)]);

    return () => clearInterval(interval);
  }, [activePiece, position, level, gameOver, movePiece]);

  // キー操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          movePiece(1, 0);
          break;
        case "ArrowDown":
          movePiece(0, 1);
          break;
        case "ArrowUp":
          rotate();
          break;
        case " ":
          hardDrop();
          break;
        case "Shift":
        case "c":
        case "C":
          hold();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePiece, position, holdPiece, canHold, movePiece, rotate, hardDrop, hold, gameOver]);

  return {
    board,
    activePiece,
    position,
    ghost,
    nextQueue,
    holdPiece,
    score,
    level,
    lines,
    gameOver,
    moveLeft: () => movePiece(-1, 0),
    moveRight: () => movePiece(1, 0),
    softDrop: () => movePiece(0, 1),
    hardDrop,
    rotate,
    hold,
  };
}
