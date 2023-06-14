import { MouseEventHandler } from 'react';

type Props = {
    value: string,
    isRecent?: boolean,
    isWin?: string,
    handleClick: MouseEventHandler
}

function Square({ value, isRecent, isWin, handleClick }: Props) {
    return (
        <div
            className={`square ${value}
            ${isRecent && "isRecent"} ${isWin}`}
            onClick={handleClick}
        ></div>
    )
}

export default Square;