import React, {useState} from 'react';
import Square from './Square';

function Board({turn, handleTurn}) {
    // inefficient method for the sake of time
    const [values, setValues] = useState([['X','X','X','X','X','X','X'],
                                          ['X','X','X','X','X','X','X'],
                                          ['X','X','X','X','X','X','X'],
                                          ['X','X','X','X','X','X','X'],
                                          ['X','X','X','X','X','X','X'],
                                          ['X','X','X','X','X','X','X']]);
    const [gameOver, setGameOver] = useState(false);

    function handleClick(row, col) {
        const newRow = checkRow(col);
        if (values[row][col] !== 'X' || newRow === -1 || gameOver) return;

        let newValues = values.slice();
        newValues[newRow][col] = turn ? "p1" : "p2";
        setValues(newValues);
        handleTurn();
        calculateWinner(newValues[newRow][col], newRow, col);
    }

    function checkRow(col) {
        for (let i = 5; i >= 0; i--) {
            if (values[i][col] === 'X') {
                return i;
            }
        }
        return -1;
    }

    function calculateWinner(player, row, col) {
        // horizontal win
        let count = 0;
        for (let i = 0; i < 7; i++) {
            if (values[row][i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(true);
        }

        // vertical win
        count = 0;
        for (let i = 0; i < 6; i++) {
            if (values[i][col] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(true);
        }

        // '\' diagonal
        count = 0;
        let startRow = row > col ? row - col : 0;
        let startCol = col > row ? col - row : 0;

        for (let i = 0; i < Math.min(6-startRow, 7-startCol); i++) {
            if (values[startRow+i][startCol+i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(true);
        }

        // '/' diagonal
        count = 0;
        startRow = row;
        startCol = col;

        while (startRow < 5 && startCol > 0) {
            startRow++;
            startCol--;
        }

        for (let i = 0; i < Math.min(startRow, 7-startCol); i++) {
            if (values[startRow-i][startCol+i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(true);
        }
    }

    return (
        <div className="board">
            <div className='board-row'>
                <Square value={values[0][0]} handleClick={() => handleClick(0,0)}/>
                <Square value={values[0][1]} handleClick={() => handleClick(0,1)}/>
                <Square value={values[0][2]} handleClick={() => handleClick(0,2)}/>
                <Square value={values[0][3]} handleClick={() => handleClick(0,3)}/>
                <Square value={values[0][4]} handleClick={() => handleClick(0,4)}/>
                <Square value={values[0][5]} handleClick={() => handleClick(0,5)}/>
                <Square value={values[0][6]} handleClick={() => handleClick(0,6)}/>
            </div>
            <div className='board-row'>
                <Square value={values[1][0]} handleClick={() => handleClick(1,0)}/>
                <Square value={values[1][1]} handleClick={() => handleClick(1,1)}/>
                <Square value={values[1][2]} handleClick={() => handleClick(1,2)}/>
                <Square value={values[1][3]} handleClick={() => handleClick(1,3)}/>
                <Square value={values[1][4]} handleClick={() => handleClick(1,4)}/>
                <Square value={values[1][5]} handleClick={() => handleClick(1,5)}/>
                <Square value={values[1][6]} handleClick={() => handleClick(1,6)}/>
            </div>
            <div className='board-row'>
                <Square value={values[2][0]} handleClick={() => handleClick(2,0)}/>
                <Square value={values[2][1]} handleClick={() => handleClick(2,1)}/>
                <Square value={values[2][2]} handleClick={() => handleClick(2,2)}/>
                <Square value={values[2][3]} handleClick={() => handleClick(2,3)}/>
                <Square value={values[2][4]} handleClick={() => handleClick(2,4)}/>
                <Square value={values[2][5]} handleClick={() => handleClick(2,5)}/>
                <Square value={values[2][6]} handleClick={() => handleClick(2,6)}/>
            </div>
            <div className='board-row'>
                <Square value={values[3][0]} handleClick={() => handleClick(3,0)}/>
                <Square value={values[3][1]} handleClick={() => handleClick(3,1)}/>
                <Square value={values[3][2]} handleClick={() => handleClick(3,2)}/>
                <Square value={values[3][3]} handleClick={() => handleClick(3,3)}/>
                <Square value={values[3][4]} handleClick={() => handleClick(3,4)}/>
                <Square value={values[3][5]} handleClick={() => handleClick(3,5)}/>
                <Square value={values[3][6]} handleClick={() => handleClick(3,6)}/>
            </div>
            <div className='board-row'>
                <Square value={values[4][0]} handleClick={() => handleClick(4,0)}/>
                <Square value={values[4][1]} handleClick={() => handleClick(4,1)}/>
                <Square value={values[4][2]} handleClick={() => handleClick(4,2)}/>
                <Square value={values[4][3]} handleClick={() => handleClick(4,3)}/>
                <Square value={values[4][4]} handleClick={() => handleClick(4,4)}/>
                <Square value={values[4][5]} handleClick={() => handleClick(4,5)}/>
                <Square value={values[4][6]} handleClick={() => handleClick(4,6)}/>
            </div>
            <div className='board-row'>
                <Square value={values[5][0]} handleClick={() => handleClick(5,0)}/>
                <Square value={values[5][1]} handleClick={() => handleClick(5,1)}/>
                <Square value={values[5][2]} handleClick={() => handleClick(5,2)}/>
                <Square value={values[5][3]} handleClick={() => handleClick(5,3)}/>
                <Square value={values[5][4]} handleClick={() => handleClick(5,4)}/>
                <Square value={values[5][5]} handleClick={() => handleClick(5,5)}/>
                <Square value={values[5][6]} handleClick={() => handleClick(5,6)}/>
            </div>
        </div>
    );
}

export default Board;