import { useState, useEffect, useCallback } from 'react';

type CellState = 'hidden' | 'revealed' | 'flagged';
type GameState = 'playing' | 'won' | 'lost';

interface Cell {
  isMine: boolean;
  state: CellState;
  neighborMines: number;
}

const BOARD_SIZE = 9;
const MINE_COUNT = 10;

const NUMBER_COLORS = [
  '', // 0
  '#0000ff', // 1 blue
  '#008000', // 2 green
  '#ff0000', // 3 red
  '#000080', // 4 navy
  '#800000', // 5 maroon
  '#008080', // 6 teal
  '#000000', // 7 black
  '#808080', // 8 gray
];

function createBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = {
        isMine: false,
        state: 'hidden',
        neighborMines: 0,
      };
    }
  }

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j].isMine) {
        let count = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE && board[ni][nj].isMine) {
              count++;
            }
          }
        }
        board[i][j].neighborMines = count;
      }
    }
  }

  return board;
}

function revealCell(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[x, y]];

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    if (newBoard[cx][cy].state !== 'hidden') continue;

    newBoard[cx][cy].state = 'revealed';

    if (newBoard[cx][cy].neighborMines === 0 && !newBoard[cx][cy].isMine) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = cx + di;
          const nj = cy + dj;
          if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
            queue.push([ni, nj]);
          }
        }
      }
    }
  }

  return newBoard;
}

function checkWin(board: Cell[][]): boolean {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j].isMine && board[i][j].state !== 'revealed') {
        return false;
      }
    }
  }
  return true;
}

export function Minesweeper({ maximized }: { maximized: boolean }) {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard());
  const [gameState, setGameState] = useState<GameState>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const cellSize = 24; // cases fixes 24x24 px

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setGameState('playing');
    setFlagCount(0);
    setTime(0);
    setFirstClick(true);
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (gameState !== 'playing' || board[x][y].state === 'flagged') return;

    let newBoard = board;

    if (firstClick && board[x][y].isMine) {
      // Move mine if first click is on a mine
      newBoard = createBoard();
      while (newBoard[x][y].isMine) {
        newBoard = createBoard();
      }
      setFirstClick(false);
    } else {
      setFirstClick(false);
    }

    if (newBoard[x][y].isMine) {
      // Reveal all mines
      const revealedBoard = newBoard.map(row =>
        row.map(cell => ({
          ...cell,
          state: cell.isMine ? 'revealed' : cell.state,
        }))
      );
      setBoard(revealedBoard);
      setGameState('lost');
      return;
    }

    const revealedBoard = revealCell(newBoard, x, y);
    setBoard(revealedBoard);

    if (checkWin(revealedBoard)) {
      setGameState('won');
    }
  }, [board, gameState, firstClick]);

  const handleCellRightClick = useCallback((e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[x][y].state === 'revealed') return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (newBoard[x][y].state === 'hidden') {
      newBoard[x][y].state = 'flagged';
      setFlagCount(c => c + 1);
    } else if (newBoard[x][y].state === 'flagged') {
      newBoard[x][y].state = 'hidden';
      setFlagCount(c => c - 1);
    }
    setBoard(newBoard);
  }, [board, gameState]);

  const getSmiley = () => {
    if (gameState === 'won') return '😎';
    if (gameState === 'lost') return '😵';
    return '😀';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      padding: '6px',
      background: '#c0c0c0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}>
      <div style={{
        border: '2px inset #808080',
        padding: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
        background: '#c0c0c0',
        width: '170px',
      }}>
        <div style={{
          background: '#000',
          color: '#ff0000',
          fontFamily: '"Digital-7", "Courier New", monospace',
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '2px 6px',
          minWidth: '40px',
          textAlign: 'center',
          border: '2px inset #808080',
          letterSpacing: '2px'
        }}>
          {String(MINE_COUNT - flagCount).padStart(3, '0')}
        </div>
        <button
          onClick={resetGame}
          style={{
            width: '26px',
            height: '26px',
            border: '2px outset #ffffff',
            background: '#c0c0c0',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {getSmiley()}
        </button>
        <div style={{
          background: '#000',
          color: '#ff0000',
          fontFamily: '"Digital-7", "Courier New", monospace',
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '2px 6px',
          minWidth: '40px',
          textAlign: 'center',
          border: '2px inset #808080',
          letterSpacing: '2px'
        }}>
          {formatTime(time)}
        </div>
      </div>

      <div style={{
        border: '3px inset #808080',
        padding: '3px',
        background: '#c0c0c0',
        display: 'inline-block',
        width: 'fit-content',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 16px)',
          gridTemplateRows: 'repeat(9, 16px)',
          gap: '0px',
        }}>
          {board.map((row, x) =>
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                onContextMenu={(e) => handleCellRightClick(e, x, y)}
                style={cell.state === 'revealed' ? {
                  width: '16px',
                  height: '16px',
                  border: '1px solid #808080',
                  background: '#c0c0c0',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: '"MS Sans Serif", sans-serif',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cell.isMine ? '#000000' : NUMBER_COLORS[cell.neighborMines],
                  userSelect: 'none',
                  boxSizing: 'border-box',
                } : {
                  width: '16px',
                  height: '16px',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  background: '#c0c0c0',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: '"MS Sans Serif", sans-serif',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: NUMBER_COLORS[cell.neighborMines],
                  userSelect: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {cell.state === 'flagged' && '🚩'}
                {cell.state === 'revealed' && cell.isMine && '💣'}
                {cell.state === 'revealed' && !cell.isMine && cell.neighborMines > 0 && cell.neighborMines}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}