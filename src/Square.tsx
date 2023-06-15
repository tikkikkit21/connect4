import { MouseEventHandler } from 'react';

type Props = {
    value: string,
    isRecent?: boolean,
    isWin?: string,
    handleClick: MouseEventHandler
}

function Square({ value, isRecent, isWin, handleClick }: Props) {
    return (
        <div className="square" onClick={handleClick}>
            <div className={`circle ${value} ${isRecent && "isRecent"} ${isWin}`} />
        </div>
    )
}

export default Square;