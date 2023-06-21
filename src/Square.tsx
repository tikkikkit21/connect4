import { MouseEventHandler } from 'react';

type Props = {
    player?: string
    coord?: string
    isRecent?: boolean
    isWin?: string
    handleClick?: MouseEventHandler
    label?: string | number
}

function Square({ player, coord, isRecent, isWin, handleClick, label }: Props) {
    return (
        <div className={`square ${coord}`} onClick={handleClick}>
            {label ? <p>{label}</p> : <div className={`circle ${player} ${isRecent && "isRecent"} ${isWin}`} />}
        </div>
    )
}

export default Square;