const BOARD_SIZE = 15; // Define the board size

class Arranger {
  constructor(words, debug = false) {
    this.words = words.map(word => word.toUpperCase());
    this.board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => ' ')
    );
    this.foundResults = new Set();
    this.debug = debug;
    this.shouldStop = false; // Flag to manually stop the arrangement
  }

  // Method to manually stop the arrangement
  stop() {
    this.shouldStop = true;
  }

  arrange() {
    if (this.debug) {
      console.log("Starting arrangement...");
    }
    this.recArrange(this.board, this.words);
  }

  recArrange(board, wordsLeft) {
    if (this.shouldStop || this.foundResults.size >= 10) {
      return; // Stop if manually stopped or after finding 10 results
    }

    if (wordsLeft.length === 0) {
      this.foundResults.add(JSON.stringify(board));
      if (this.debug) {
        console.log("Found a valid arrangement:", board);
      }
      return;
    }

    for (let orientation = 0; orientation <= 1; orientation++) {
      for (let word of wordsLeft) {
        const tmpWordsLeft = wordsLeft.filter(w => w !== word);
        if (this.isEmpty(board)) {
          const tmpBoard = this.copyBoard(board);
          try {
            this.placeWord(tmpBoard, word, orientation, Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2), Math.floor(word.length / 2));
            this.recArrange(tmpBoard, tmpWordsLeft);
          } catch (e) {
            if (this.debug) {
              console.log(`Skipping placement of ${word}: ${e.message}`);
            }
          }
        } else {
          let placed = false;
          for (let x = 0; x < BOARD_SIZE; x++) {
            for (let y = 0; y < BOARD_SIZE; y++) {
              if (board[x][y] !== ' ') {
                for (let i = 0; i < word.length; i++) {
                  if (word[i] === board[x][y]) {
                    const tmpBoard = this.copyBoard(board);
                    try {
                      this.placeWord(tmpBoard, word, orientation, x, y, i);
                      placed = true;
                      this.recArrange(tmpBoard, tmpWordsLeft);
                    } catch (e) {
                      if (this.debug) {
                        console.log(`Skipping placement of ${word} at (${x}, ${y}): ${e.message}`);
                      }
                    }
                  }
                }
              }
            }
          }
          if (!placed && this.debug) {
            console.log(`Could not place ${word} on the board without isolation.`);
          }
        }
      }
    }
  }

  placeWord(board, word, orientation, x, y, offset) {
    if (orientation === 0) {
      // Horizontal placement
      for (let i = 0; i < word.length; i++) {
        const newX = x;
        const newY = y - offset + i;
        if (newY < 0 || newY >= BOARD_SIZE) {
          throw new Error('Word placement out of bounds');
        }
        if (board[newX][newY] !== ' ' && board[newX][newY] !== word[i]) {
          throw new Error('Collision detected');
        }
        board[newX][newY] = word[i];
      }

      // Check for unintended vertical words after placing the horizontal word
      for (let i = 0; i < word.length; i++) {
        const newX = x;
        const newY = y - offset + i;
        this.checkForUnintendedWords(board, newX, newY);
      }
    } else {
      // Vertical placement
      for (let i = 0; i < word.length; i++) {
        const newX = x - offset + i;
        const newY = y;
        if (newX < 0 || newX >= BOARD_SIZE) {
          throw new Error('Word placement out of bounds');
        }
        if (board[newX][newY] !== ' ' && board[newX][newY] !== word[i]) {
          throw new Error('Collision detected');
        }
        board[newX][newY] = word[i];
      }

      // Check for unintended horizontal words after placing the vertical word
      for (let i = 0; i < word.length; i++) {
        const newX = x - offset + i;
        const newY = y;
        this.checkForUnintendedWords(board, newX, newY);
      }
    }
  }

  checkForUnintendedWords(board, x, y) {
    // Check for unintended horizontal words
    let horizontalWord = '';
    let left = y;
    while (left >= 0 && board[x][left] !== ' ') {
      horizontalWord = board[x][left] + horizontalWord;
      left--;
    }
    let right = y + 1;
    while (right < BOARD_SIZE && board[x][right] !== ' ') {
      horizontalWord += board[x][right];
      right++;
    }
    if (horizontalWord.length > 1 && !this.words.includes(horizontalWord)) {
      throw new Error(`Unintended horizontal word detected: ${horizontalWord}`);
    }

    // Check for unintended vertical words
    let verticalWord = '';
    let top = x;
    while (top >= 0 && board[top][y] !== ' ') {
      verticalWord = board[top][y] + verticalWord;
      top--;
    }
    let bottom = x + 1;
    while (bottom < BOARD_SIZE && board[bottom][y] !== ' ') {
      verticalWord += board[bottom][y];
      bottom++;
    }
    if (verticalWord.length > 1 && !this.words.includes(verticalWord)) {
      throw new Error(`Unintended vertical word detected: ${verticalWord}`);
    }
  }

  isEmpty(board) {
    return board.every(row => row.every(cell => cell === ' '));
  }

  copyBoard(board) {
    return board.map(row => [...row]);
  }
}

// Export the Arranger class
export default Arranger;