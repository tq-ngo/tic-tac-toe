import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
const clickSound = new Audio(clickSoundAsset);
gameOverSound.volume = 0.2;
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  // rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },
  // columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },
  // diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

// Minimax Algorithm
function checkWinnerStatus(tiles) {
  for (const { combo } of winningCombinations) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a]; // 'X' or 'O'
    }
  }
  if (tiles.every((tile) => tile !== null)) {
    return "draw";
  }
  return null;
}

const scores = {
  [PLAYER_O]: 10, // bot win
  [PLAYER_X]: -10, // player win
  draw: 0,
};

function findBestMove(tiles) {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (tiles[i] == null) {
      tiles[i] = PLAYER_O;
      let score = minimax(tiles, 0, false);
      tiles[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

function minimax(tiles, depth, isMax) {
  const res = checkWinnerStatus(tiles);
  if (res !== null) {
    return scores[res];
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (tiles[i] === null) {
        tiles[i] = PLAYER_O;
        let score = minimax(tiles, depth + 1, false);
        tiles[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  }
  else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (tiles[i] === null) {
        tiles[i] = PLAYER_X;
        let score = minimax(tiles, depth + 1, true);
        tiles[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X) {
        setGameState(GameState.playerXWins);
      } else {
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }
  const areAllTilesFilled = tiles.every((tile) => tile !== null);
  if (areAllTilesFilled) {
    setGameState(GameState.draw);
  }
}

function PlayervsBot() {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);

  const handleTileClick = (index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null || playerTurn === PLAYER_O) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    setPlayerTurn(PLAYER_O);
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  useEffect(() => {
    if (playerTurn === PLAYER_O && gameState === GameState.inProgress) {
      // check if there are moves left before thinking
      const isFull = tiles.every((t) => t !== null);
      if (isFull) return;

      const botTimer = setTimeout(() => {
        const bestMoveIndex = findBestMove([...tiles]);
        
        // Ensure a valid move was found before updating
        if (bestMoveIndex !== undefined && bestMoveIndex !== -1) {
          const newTiles = [...tiles];
          newTiles[bestMoveIndex] = PLAYER_O;
          setTiles(newTiles);
          setPlayerTurn(PLAYER_X);
        }
      }, 100);

      return () => clearTimeout(botTimer);
    }
  }, [playerTurn, gameState, tiles]);

  return (
    <div>
      <button
        onClick={handleBack}
        className="back-button"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
      <h1>TIC TAC TOE</h1>
      <Board
        playerTurn={playerTurn}
        tiles={tiles}
        onTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

export default PlayervsBot;