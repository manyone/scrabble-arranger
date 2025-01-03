import React, { useState } from 'react';
import Arranger from './Arranger';
import ScrabbleTiles from './ScrabbleTiles';
import './App.css';

const BOARD_SIZE = 15; // Define BOARD_SIZE

function App() {
  const [inputWords, setInputWords] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArrangement, setSelectedArrangement] = useState(null);
  const [showTiles, setShowTiles] = useState(false);
  const [adjustedBoard, setAdjustedBoard] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordsArray = inputWords.split(' ').filter(word => word.trim() !== '');
    const arranger = new Arranger(wordsArray, false);
    arranger.arrange();
    console.log("Found arrangements:", arranger.foundResults.size);
    setResults([...arranger.foundResults]);
    setSelectedArrangement(null);
    setShowTiles(false);
    setAdjustedBoard(null);
  };

  const handleSelectArrangement = (index) => {
    const board = JSON.parse(results[index]);
    const adjusted = adjustBoard(board);
    setSelectedArrangement(index);
    setAdjustedBoard(adjusted);
    setShowTiles(false);
  };

  const handleRenderTiles = () => {
    if (selectedArrangement !== null) {
      setShowTiles(true);
    } else {
      alert('Please select an arrangement first.');
    }
  };

  // Function to adjust the board: isolate the area with words and add 2-tile margins
const adjustBoard = (board) => {
  let minX = BOARD_SIZE, minY = BOARD_SIZE, maxX = 0, maxY = 0;

  // Find the boundaries of the words
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (board[x][y] !== ' ') {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 1-tile margins
  minX = Math.max(0, minX - 1); // Change from 2 to 1
  minY = Math.max(0, minY - 1); // Change from 2 to 1
  maxX = Math.min(BOARD_SIZE - 1, maxX + 1); // Change from 2 to 1
  maxY = Math.min(BOARD_SIZE - 1, maxY + 1); // Change from 2 to 1

  // Create the adjusted board
  const adjusted = [];
  for (let x = minX; x <= maxX; x++) {
    const row = [];
    for (let y = minY; y <= maxY; y++) {
      row.push(board[x][y]);
    }
    adjusted.push(row);
  }

  return adjusted;
};

  return (
    <div className="App">
      <h1>Word Arranger</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputWords}
          onChange={(e) => setInputWords(e.target.value)}
          placeholder="Enter words separated by spaces"
        />
        <button type="submit">Arrange Words</button>
      </form>

      <div className="results">
        <h2>Results:</h2>
        {results.length > 0 ? (
          <>
            {results.map((result, index) => (
              <div key={index}>
                <label>
                  <input
                    type="radio"
                    name="arrangement"
                    checked={selectedArrangement === index}
                    onChange={() => handleSelectArrangement(index)}
                  />
                  Arrangement {index + 1}
                </label>
              </div>
            ))}
            <button onClick={handleRenderTiles}>Render Tiles</button>
            {adjustedBoard && (
              <div className="adjusted-board">
                <h3>Adjusted Board:</h3>
                <pre>
                  {adjustedBoard.map((row, x) => (
                    <div key={x}>
                      {row.map((cell, y) => (
                        <span key={y}>{cell === ' ' ? '.' : cell}</span>
                      ))}
                    </div>
                  ))}
                </pre>
              </div>
            )}
            {showTiles && adjustedBoard && (
              <ScrabbleTiles board={adjustedBoard} />
            )}
          </>
        ) : (
          <p>No results yet. Enter words and click "Arrange Words" to see arrangements.</p>
        )}
      </div>
    </div>
  );
}

export default App;