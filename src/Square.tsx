import { MouseEventHandler } from 'react';

type Props = {
    value: string,
    isRecent?: boolean,
    handleClick: MouseEventHandler
}

function Square({ value, isRecent, handleClick }: Props) {
    return <div className={`square ${value} ${isRecent && "isRecent"}`} onClick={handleClick}></div>
}

export default Square;