import { MouseEventHandler } from 'react';

type Props = {
    value: string,
    handleClick: MouseEventHandler
}

function Square({ value, handleClick }: Props) {
    return <div className='square' data-value={value} onClick={handleClick}></div>
}

export default Square;