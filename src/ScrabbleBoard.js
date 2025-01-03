
const ScrabbleBoard = ({ board }) => {
  return (
    <div className="scrabble-board">
      {board.map((row, x) => (
        <div key={x} className="board-row">
          {row.map((cell, y) => (
            <div key={y} className="board-cell">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScrabbleBoard;