import Square from './Square';

type Props = {
    values: Array<Array<string>>,
    handleClick: Function,
    recent: string
}

function Board({ values, handleClick, recent }: Props) {
    const [moveRow, moveCol]: number[] = recent.split(",").map(Number);
    const rows = [];

    // populate board
    for (let row = 0; row < 6; row++) {
        const cols = [];

        for (let col = 0; col < 7; col++) {
            cols.push(
                <Square
                    value={values[row][col]}
                    handleClick={() => handleClick(row, col)}
                    isRecent={(moveRow === row && moveCol === col) || undefined}
                />
            )
        }

        rows.push(
            <div className='board-row'>
                {cols}
            </div>
        );
    }

    return (
        <div className="board">
            {rows}
        </div>
    );
}

export default Board;