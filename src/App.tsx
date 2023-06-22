import Game from './Game';
import { io } from 'socket.io-client';

const SERVER_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:1717"
    : "https://tikkikkit21-connect4.chickenkiller.com:1717/";

const socket = io(SERVER_URL);

function App() {
    return (
        <div className="App">
            <h1>Connect 4</h1>
            <Game socket={socket} />
        </div>
    );
}

export default App;
