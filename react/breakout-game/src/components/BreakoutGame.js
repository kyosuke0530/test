// src/components/BreakoutGame.jsx
import React, { useRef, useEffect } from 'react';

const BreakoutGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
  
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
  
      x += dx;
      y += dy;
  
      requestAnimationFrame(draw);
    }
  
    draw();
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={320}
      style={{ border: '2px solid #333' }}
    />
  );
};

export default BreakoutGame;
