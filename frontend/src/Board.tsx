import Square from './Square';
import { useState } from 'react';

type Props = {
    values: Array<Array<string>>
    recent: string
    winningMoves: Array<string>
    handleClick: Function
    getPlayer: Function
}

function Board({ values, recent, winningMoves, handleClick, getPlayer }: Props) {
    const [moveRow, moveCol]: number[] = recent.split(",").map(Number);
    const [resetPreview, setResetPreview] = useState(false);
    const rows = [];

    // populate board
    for (let row = 5; row >= 0; row--) {
        const cols = [];

        cols.push(<Square key="label" label={row + 1} coord={"label-row"} />);
        for (let col = 0; col < 7; col++) {
            cols.push(
                <Square
                    key={col}
                    player={values[row][col]}
                    isRecent={(moveRow === row && moveCol === col) || undefined}
                    isWin={winningMoves.includes(`${row},${col}`) ? `win-${values[row][col]}` : undefined}
                    reset={resetPreview}
                    handleClick={() => {
                        handleClick(row, col);
                        setResetPreview(!resetPreview);
                    }}
                    getPlayer={getPlayer}
                />
            );
        }

        rows.push(
            <div key={row} className='board-row'>
                {cols}
            </div>
        );
    }

    const colLabels = [];
    colLabels.push(<Square key="label" coord={"label-col label-row"} />);
    for (let col = 0; col < 7; col++) {
        colLabels.push(<Square key={col} label={String.fromCharCode(97 + col)} coord={"label-col"} />);
    }

    return (
        <div className="board">
            {rows}
            <div className="board-row">{colLabels}</div>
        </div>
    );
}

export default Board;