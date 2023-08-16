// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import {useLocalStorageState} from '../utils';

function Board({selectSquare, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="game-board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'board',
    Array(Array(9).fill(null)),
  );
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0);
  const squares = history[currentStep];
  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);

  function selectSquare(square) {
    // if there's already a winner or there's already a value at the
    // given square index, return early so we don't make any state changes
    if (winner || squares[square]) {
      return;
    }

    // if we re-do a step, erase the game state following that step
    const tempHistory = history.slice(0, currentStep + 1);
    const tempSquares = [...squares];
    tempSquares[square] = nextValue;

    setHistory([...tempHistory, tempSquares]);
    setCurrentStep(currentStep + 1);
  }

  function restart() {
    setCurrentStep(0);
    setHistory(Array(Array(9).fill(null)));
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <ol>
            {history.map((step, index) => (
              <li key={history[index].join()}>
                <button
                  onClick={() => setCurrentStep(index)}
                  disabled={currentStep === index}
                >
                  {`Go to ${
                    index === 0 ? 'game start' : `move #${index}`
                  }`.concat(index === currentStep ? ' (Current)' : '')}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
