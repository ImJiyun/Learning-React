import { useState } from "react";

// deriving state from props
export default function GameBoard({ onSelectSquare, board }) {
  /*
  const [gameBoard, setGameBoard] = useState(initialGameBoard); // to manage and update the game board

  function handleSelectSquare(rowIndex, colIndex) {
    // update the object state immutably
    // prevGameBoard represents the current game board state before the update.
    setGameBoard((prevGameBoard) => {
      // create a new board
      // prevGameBoard.map : loops through each row of the board, returns a new array for each row by copying its element
      // ...innerArray : uses the spread operator to create a shallow copy of each row
      const updatedBoard = [
        ...prevGameBoard.map((innerArray) => [...innerArray]),
      ];
      updatedBoard[rowIndex][colIndex] = activePlayerSymbol; // the value is updated
      return updatedBoard; // React updates the state with this new board, which triggers a re-render of the component
    });

    onSelectSquare();
  }
    */

  // rendering multi-dimensional lists
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol != null}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
