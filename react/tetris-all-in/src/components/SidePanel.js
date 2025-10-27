import React from "react";

function MiniPiece({ piece }) {
  if (!Array.isArray(piece) || piece.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-[1px]">
      {piece.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-4 h-4 ${cell ? `bg-${cell}-500` : "bg-black"} border border-gray-800`}
          ></div>
        ))
      )}
    </div>
  );
}

export default function SidePanel({ nextQueue, holdPiece, score, level, lines }) {
  const validHoldPiece = Array.isArray(holdPiece) ? holdPiece : [];
  const validNextQueue = Array.isArray(nextQueue) ? nextQueue : [];

  return (
    <div className="p-2 text-white">
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-1">Hold</h2>
        <MiniPiece piece={validHoldPiece} />
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold mb-1">Next</h2>
        {validNextQueue.map((piece, i) => (
          <div key={i} className="mb-2">
            <MiniPiece piece={piece} />
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p>Score: {score}</p>
        <p>Level: {level}</p>
        <p>Lines: {lines}</p>
      </div>
    </div>
  );
}
