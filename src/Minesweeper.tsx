// Minesweeper.tsx
import React, { useState } from "react";

type Props = {
  onGameEnd: (won: boolean) => Promise<void>;
  onBack: () => void;
  onRestart: () => Promise<void>;
};

type Cell = {
  hasBomb: boolean;
  revealed: boolean;
};

const GRID_SIZE = 5;
const BOMB_COUNT = 1;

const generateGrid = (): Cell[][] => {
  const grid: Cell[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        hasBomb: false,
        revealed: false,
      }))
    );

  let bombsPlaced = 0;
  while (bombsPlaced < BOMB_COUNT) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[row][col].hasBomb) {
      grid[row][col].hasBomb = true;
      bombsPlaced++;
    }
  }

  return grid;
};

const Minesweeper: React.FC<Props> = ({ onGameEnd, onBack, onRestart }) => {
  const [grid, setGrid] = useState<Cell[][]>(generateGrid);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const revealCell = async (row: number, col: number) => {
    if (gameOver || grid[row][col].revealed) return;

    const updatedGrid = [...grid];
    updatedGrid[row][col].revealed = true;
    setGrid(updatedGrid);

    if (updatedGrid[row][col].hasBomb) {
      setGameOver(true);
      setMessage("💣 Boom! Oyunu kaybettin.");
      await onGameEnd(false);
    } else {
      const allSafeRevealed = updatedGrid.flat().filter(c => !c.hasBomb).every(c => c.revealed);
      if (allSafeRevealed) {
        setGameOver(true);
        setMessage("🎉 Tebrikler! Tüm güvenli hücreleri açtın.");
        await onGameEnd(true);
      }
    }
  };

  const cellStyle = {
    width: 50,
    height: 50,
    margin: 2,
    fontSize: 18,
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "pointer"
  };

  const renderCell = (cell: Cell, row: number, col: number) => {
    return (
      <button
        key={`${row}-${col}`}
        style={cellStyle}
        onClick={() => revealCell(row, col)}
        disabled={cell.revealed || gameOver}
      >
        {cell.revealed ? (cell.hasBomb ? "💣" : "✔️") : ""}
      </button>
    );
  };

  const handleRestart = async () => {
    await onRestart(); // ödeme alınır
    setGrid(generateGrid());
    setGameOver(false);
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px", color: "white" }}>
      <h3>🧨 Minesweeper</h3>
      <div style={{ display: "inline-block" }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", justifyContent: "center" }}>
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </div>
        ))}
      </div>

      {message && <p style={{ marginTop: "20px", fontSize: "16px" }}>{message}</p>}

      <div style={{ marginTop: "30px" }}>
  <button
    onClick={handleRestart}
    style={{
      marginRight: "10px",
      padding: "10px 18px",
      fontWeight: "bold",
      backgroundColor: "#ffffff",
      color: "#222222",
      border: "2px solid #444",
      borderRadius: "6px",
      cursor: "pointer"
    }}>
    Restart Game
  </button>
  <button
    onClick={onBack}
    style={{
      padding: "10px 18px",
      fontWeight: "bold",
      backgroundColor: "#ffffff",
      color: "#222222",
      border: "2px solid #444",
      borderRadius: "6px",
      cursor: "pointer"
    }}>
    Main Menu
  </button>
</div>
    </div>
  );
};

export default Minesweeper;
