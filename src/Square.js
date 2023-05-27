import React from 'react';

function Square({value, handleClick}) {
    return <div className='square' value={value} onClick={handleClick}></div>
}

export default Square;