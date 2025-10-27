import React, { useState, useEffect, useCallback } from 'react';

// ゲームボードのサイズ
const ROWS = 20;
const COLS = 10;

// 空のボード作成
const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// テトリミノの定義
const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: 'cyan' },       // I
  { shape: [[1, 1], [1, 1]], color: 'yellow' },   // O
  { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },  // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },    // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' },   // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' }, // J
];

// ランダムにテトリノを生成
const generateTetromino = () => {
  const index = Math.floor(Math.random() * TETROMINOS.length);
  return TETROMINOS[index];
};

const App = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [tetromino, setTetromino] = useState(generateTetromino());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);  // 一時停止フラグ

  const isValidMove = useCallback((tetromino, newPosition) => {
    const { shape } = tetromino;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newY = newPosition.y + y;
          const newX = newPosition.x + x;

          if (
            newY >= ROWS ||
            newX < 0 ||
            newX >= COLS ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const calculateScore = (clearedLines) => {
    const points = [0, 100, 300, 500, 800];
    return points[clearedLines] || 0;
  };

  const placeTetromino = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    const { shape, color } = tetromino;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newY = position.y + y;
          const newX = position.x + x;
          if (newY >= 0) {
            newBoard[newY][newX] = color;
          }
        }
      }
    }

    // 行消去処理
    const clearFullRows = (board) => {
      const filtered = board.filter(row => row.some(cell => cell === null));
      const clearedLines = ROWS - filtered.length;
      const newEmptyRows = Array.from({ length: clearedLines }, () => Array(COLS).fill(null));
      return {
        board: [...newEmptyRows, ...filtered],
        clearedLines,
      };
    };

    const { board: clearedBoard, clearedLines } = clearFullRows(newBoard);
    setBoard(clearedBoard);

    // スコアとレベル
    const gained = calculateScore(clearedLines);
    setScore(prev => {
      const newScore = prev + gained;
      setLevel(Math.floor(newScore / 500) + 1);
      return newScore;
    });
  }, [board, tetromino, position]);

  const moveTetrominoDown = useCallback(() => {
    const newPosition = { x: position.x, y: position.y + 1 };

    if (isValidMove(tetromino, newPosition)) {
      setPosition(newPosition);
    } else {
      placeTetromino();
      const newTetromino = generateTetromino();
      setTetromino(newTetromino);
      setPosition({ x: 3, y: 0 });

      // ゲームオーバー判定
      if (!isValidMove(newTetromino, { x: 3, y: 0 })) {
        setIsGameOver(true);
      }
    }
  }, [tetromino, position, placeTetromino, isValidMove]);

  // 回転処理 (時計回り)
  const rotateTetrominoClockwise = useCallback(() => {
    const rotatedShape = tetromino.shape[0].map((_, index) =>
      tetromino.shape.map(row => row[index])
    ).reverse(); // 90度回転
    const newTetromino = { ...tetromino, shape: rotatedShape };

    if (isValidMove(newTetromino, position)) {
      setTetromino(newTetromino);
    }
  }, [tetromino, position, isValidMove]);

  // 回転処理 (反時計回り)
  const rotateTetrominoCounterClockwise = useCallback(() => {
    const rotatedShape = tetromino.shape.reverse().map((_, index) =>
      tetromino.shape.map(row => row[index])
    ); // 反時計回りの90度回転
    const newTetromino = { ...tetromino, shape: rotatedShape };

    if (isValidMove(newTetromino, position)) {
      setTetromino(newTetromino);
    }
  }, [tetromino, position, isValidMove]);

  const handleKeyPress = (e) => {
    if (isGameOver || isPaused) return;

    if (e.key === 'ArrowLeft') {
      const newPos = { x: position.x - 1, y: position.y };
      if (isValidMove(tetromino, newPos)) setPosition(newPos);
    } else if (e.key === 'ArrowRight') {
      const newPos = { x: position.x + 1, y: position.y };
      if (isValidMove(tetromino, newPos)) setPosition(newPos);
    } else if (e.key === 'ArrowDown') {
      moveTetrominoDown();
    } else if (e.key === 'ArrowUp') {
      rotateTetrominoClockwise(); // 時計回りに回転
    } else if (e.key === ' ') {
      rotateTetrominoCounterClockwise(); // 反時計回りに回転
    } else if (e.key === 'p') {
      // 一時停止のトグル
      setIsPaused(prev => !prev);
    }
  };

  // インターバルの設定
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const interval = setInterval(() => {
      if (!isPaused && !isGameOver) moveTetrominoDown();
    }, Math.max(100, 1000 - (level - 1) * 100));

    return () => clearInterval(interval); // インターバルIDを使わず、直接クリーンアップ
  }, [moveTetrominoDown, isPaused, isGameOver, level]);

  const renderBoard = () => {
    const tempBoard = board.map(row => [...row]);
    const { shape, color } = tetromino;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newY = position.y + y;
          const newX = position.x + x;
          if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
            tempBoard[newY][newX] = color;
          }
        }
      }
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
        }}
      >
        {tempBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: cell || 'white',
                border: '1px solid lightgray',
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div
      id="game"
      tabIndex="0"
      onKeyDown={handleKeyPress}
      style={{ outline: 'none' }}
    >
      <h2>Score: {score}</h2>
      <h3>Level: {level}</h3>
      <h3>{isPaused ? 'Paused' : ''}</h3>
      {renderBoard()}
      {isGameOver && (
        <div>
          <button onClick={() => setIsGameOver(false)}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
