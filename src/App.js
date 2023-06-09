import React from 'react';
import Game from './Game';
import {io} from 'socket.io-client';

const SERVER_URL = "http://localhost:1717";
const socket = io(SERVER_URL);

function App() {
    return (
        <div className="App">
            <h1>Connect 4</h1>
            <Game socket={socket}/>
        </div>
    );
}

export default App;
