import Game from './Game';
import { io } from 'socket.io-client';

const SERVER_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:1717"
    : "http://108.61.202.233:1717";

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
