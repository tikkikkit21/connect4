import React from 'react';
import Square from './Square';

function Board() {
    return (
        <div className="board">
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
            <div className='board-row'>
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
                <Square />
            </div>
        </div>
    );
}

export default Board;