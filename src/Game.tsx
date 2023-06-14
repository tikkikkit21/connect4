import { useEffect, useState, useRef } from 'react';
import Board from './Board';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

let turn = "p1";

const emptyBoard: Array<Array<string>> = [];
for (let i = 0; i < 6; i++) {
    emptyBoard.push(Array(7).fill("X"));
}

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

type History = {
    board: Array<Array<string>>,
    recentMove: string
}

function Game({ socket }: Props) {
    const [gameOver, setGameOver] = useState(0);
    const [player, setPlayer] = useState<string>();

    const [history, setHistory] = useState<Array<History>>([
        { board: emptyBoard.map(row => row.slice()), recentMove: "" }
    ]);
    
    const [currMove, setCurrMove] = useState(0);
    const lengthRef = useRef(0);
    lengthRef.current = history.length - 1;

    function handleClick(row: number, col: number): void {
        const newRow = checkRow(col);
        if (turn !== player
            || history[history.length - 1].board[row][col] !== 'X'
            || newRow === -1
            || gameOver
            || currMove !== history.length - 1
        ) return;

        socket.emit("move", `${newRow},${col}`);
    }

    function handleGameOver(player: string) {
        setGameOver(Number(player[1]));
    }

    function handleTurn(row: number, col: number) {
        setHistory(prevHist => {
            const newBoard = prevHist[lengthRef.current].board.map(row => row.slice());
            newBoard[row][col] = turn;

            const nextHistory = [...prevHist.slice(), {
                board: newBoard,
                recentMove: `${row},${col}`
            }];

            setCurrMove(nextHistory.length - 1);
            calculateWinner(turn, row, col, newBoard);
            turn = (turn === "p1" ? "p2" : "p1");

            return nextHistory;
        });
    }

    function resetGame() {
        setCurrMove(0);
        setGameOver(0);
        turn = "p1";
        setHistory([{ board: emptyBoard.map(row => row.slice()), recentMove: "" }]);
    }

    // algorithm to check if a move wins the game
    function calculateWinner(player: string, row: number, col: number, newValues: Array<Array<string>>) {
        // horizontal win
        let count = 0;
        for (let i = 0; i < 7; i++) {
            if (newValues[row][i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return handleGameOver(player);
        }

        // vertical win
        count = 0;
        for (let i = 0; i < 6; i++) {
            if (newValues[i][col] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return handleGameOver(player);
        }

        // '\' diagonal
        count = 0;
        let startRow = row > col ? row - col : 0;
        let startCol = col > row ? col - row : 0;

        for (let i = 0; i < Math.min(6 - startRow, 7 - startCol); i++) {
            if (newValues[startRow + i][startCol + i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return handleGameOver(player);
        }

        // '/' diagonal
        count = 0;
        startRow = row;
        startCol = col;

        while (startRow < 5 && startCol > 0) {
            startRow++;
            startCol--;
        }

        for (let i = 0; i < Math.min(startRow, 7 - startCol); i++) {
            if (newValues[startRow - i][startCol + i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return handleGameOver(player);
        }
    }

    // helper function for "enforcing gravity"
    function checkRow(col: number) {
        for (let i = 5; i >= 0; i--) {
            if (history[history.length - 1].board[i][col] === 'X') {
                return i;
            }
        }
        return -1;
    }

    useEffect(() => {
        socket.on("move", (msg: string) => {
            const [row, col]: string[] = msg.split(",");

            handleTurn(Number(row), Number(col));
        });

        socket.on("player", p => {
            console.log("I am player", p);
            setPlayer(p);
        });

        socket.on("gg", () => {
            resetGame();
        });
    }, [socket]);

    const historyDisplay = history.map((value, move) => {
        return (
            <li key={move}>
              <button onClick={() => setCurrMove(move)}>{"Go to move " + move}</button>
            </li>
          );
    });

    return (
        <>
            <Board values={history[currMove].board} handleClick={handleClick} recent={history[currMove].recentMove} />
            {player === turn ? <p>It is your turn</p> : <p>Waiting for opponent</p>}
            <ol>{historyDisplay}</ol>

            {gameOver > 0 && <h1>Winner: P{gameOver}</h1>}
            {gameOver > 0 &&
                <div className="reset">
                    <input type="submit" className="reset" value="New Game" onClick={() => socket.emit("gg", "")} />
                </div>
            }
        </>
    );
}

export default Game;