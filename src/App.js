import React, {useState} from 'react';
import Board from './Board';

function App() {
    const [turn, setTurn] = useState(true); // true = p1, false = p2

    function handleTurn() {
        setTurn(!turn);
    }

    return (
        <div className="App">
            <h1>Connect 4</h1>
            <Board turn={turn} handleTurn={handleTurn} />
        </div>
    );
}

export default App;
