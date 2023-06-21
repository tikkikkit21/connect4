import { MouseEventHandler, useState, useEffect } from 'react';

type Props = {
    player?: string
    coord?: string
    isRecent?: boolean
    isWin?: string
    label?: string | number
    reset?: boolean
    handleClick?: MouseEventHandler
    getPlayer?: Function
}

function Square({ player, coord, isRecent, isWin, label, reset, handleClick, getPlayer }: Props) {
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        setPreview(undefined);
    }, [reset]);

    function togglePreview() {
        const p = getPlayer && getPlayer();

        if (!preview) {
            setPreview(p);
        } else if (preview === p) {
            setPreview(preview === "p1" ? "p2" : "p1");
        } else {
            setPreview(undefined);
        }
    }

    return (
        <div
            className={`square ${coord}`}
            onClick={handleClick}
            onContextMenu={(e) => {
                e.preventDefault();
                togglePreview();
            }}
        >
            {label ? <p>{label}</p> : <div className={`circle ${player} ${isRecent && "isRecent"} ${isWin} preview-${preview}`} />}
        </div>
    )
}

export default Square;