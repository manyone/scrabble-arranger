import React from 'react';
import './ScrabbleTiles.css';
import feltBackground from './assets/felt_background.jpg'; // Updated import path

const ScrabbleTiles = ({ board }) => {
  const tilePoints = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
  };

  return (
    <div
      className="scrabble-tiles"
      style={{
        backgroundImage: `url(${feltBackground})`, // Updated background image path
        backgroundSize: 'cover',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      {board.map((row, x) => (
        <div key={x} className="tile-row">
          {row.map((cell, y) => (
            <div key={y} className="tile-container">
              {cell !== ' ' ? (
                <div className="tile">
                  <div className="tile-letter">{cell}</div>
                  <div className="tile-points">{tilePoints[cell] || 0}</div>
                </div>
              ) : (
                <div className="empty-cell"></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScrabbleTiles;