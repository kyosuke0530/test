import React from "react";

const COLOR_MAP = {
  1: "bg-cyan-500",
  2: "bg-yellow-500",
  3: "bg-purple-500",
  4: "bg-green-500",
  5: "bg-red-500",
  6: "bg-blue-500",
  7: "bg-orange-500",
};

export function Board({ state, ghost }) {
  return (
    <div className="grid grid-rows-20 grid-cols-10 gap-[1px] bg-gray-800">
      {state.map((row, y) =>
        row.map((cell, x) => {
          const ghostCell = ghost?.[y]?.[x];
          const colorClass = COLOR_MAP[cell] || (ghostCell ? "bg-white opacity-20" : "bg-black");
          return (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 ${colorClass}`}
            ></div>
          );
        })
      )}
    </div>
  );
}
