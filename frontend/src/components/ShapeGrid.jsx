// src/components/ShapeGrid.jsx
import { useRef, useEffect } from 'react';

const ShapeGrid = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  shape = 'square',
  hoverTrailAmount = 0
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const numSquaresX = useRef(0);
  const numSquaresY = useRef(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);
  const trailCells = useRef([]);
  const cellOpacities = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 2;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 2;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colShift = Math.floor(gridOffset.current.x / squareSize);
      const rowShift = Math.floor(gridOffset.current.y / squareSize);

      for (let i = -2; i < numSquaresX.current; i++) {
        for (let j = -2; j < numSquaresY.current; j++) {
          const cx = i * squareSize + (gridOffset.current.x % squareSize + squareSize) % squareSize;
          const cy = j * squareSize + (gridOffset.current.y % squareSize + squareSize) % squareSize;

          const cellKey = `${i + colShift},${j + rowShift}`;
          const opacity = cellOpacities.current.get(cellKey) || 0;

          if (opacity > 0) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(cx, cy, squareSize, squareSize);
          }

          ctx.globalAlpha = 1;
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(cx, cy, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const wrapX = squareSize;
      const wrapY = squareSize;

      if (direction === 'right') gridOffset.current.x -= speed;
      if (direction === 'left') gridOffset.current.x += speed;
      if (direction === 'up') gridOffset.current.y += speed;
      if (direction === 'down') gridOffset.current.y -= speed;

      gridOffset.current.x = (gridOffset.current.x % wrapX + wrapX) % wrapX;
      gridOffset.current.y = (gridOffset.current.y % wrapY + wrapY) % wrapY;

      const targets = new Map();
      if (hoveredSquareRef.current) {
        targets.set(`${hoveredSquareRef.current.i},${hoveredSquareRef.current.j}`, 1);
      }
      trailCells.current.forEach((t, index) => {
        const key = `${t.i},${t.j}`;
        if (!targets.has(key)) {
          targets.set(key, (1 - (index + 1) / (trailCells.current.length + 1)) * 0.5);
        }
      });

      for (const [key, target] of targets) {
        const current = cellOpacities.current.get(key) || 0;
        cellOpacities.current.set(key, current + (target - current) * 0.1);
      }

      for (const [key, current] of cellOpacities.current) {
        if (!targets.has(key)) {
          const next = current * 0.9;
          if (next < 0.01) cellOpacities.current.delete(key);
          else cellOpacities.current.set(key, next);
        }
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleInteraction = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const colShift = Math.floor(gridOffset.current.x / squareSize);
      const rowShift = Math.floor(gridOffset.current.y / squareSize);

      const i = Math.floor((x - (gridOffset.current.x % squareSize + squareSize) % squareSize) / squareSize) + colShift;
      const j = Math.floor((y - (gridOffset.current.y % squareSize + squareSize) % squareSize) / squareSize) + rowShift;

      if (!hoveredSquareRef.current || hoveredSquareRef.current.i !== i || hoveredSquareRef.current.j !== j) {
        if (hoveredSquareRef.current && hoverTrailAmount > 0) {
          trailCells.current.unshift({...hoveredSquareRef.current});
          if (trailCells.current.length > hoverTrailAmount) trailCells.current.pop();
        }
        hoveredSquareRef.current = { i, j };
      }
    };

    const handleMouseMove = (e) => handleInteraction(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, shape, hoverTrailAmount]);

  return <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />;
};

export default ShapeGrid;
