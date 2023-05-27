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

    function handleClick(row, col) {
        if (values[row][col] !== 'X') return;

        let newValues = values.slice();
        newValues[row][col] = turn ? "p1" : "p2";
        setValues(newValues);
        handleTurn();
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