import { useEffect, useState } from 'react';
import Board from './Board';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

let turn = "p1";

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const emptyBoard: Array<Array<string>> = [['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X']];

function Game({ socket }: Props) {
    const [values, setValues] = useState(emptyBoard.map(arr => arr.slice()));
    const [gameOver, setGameOver] = useState<string>();
    const [player, setPlayer] = useState();
    const [recentMove, setRecentMove] = useState<string>("");

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

    function handleClick(row: number, col: number): void {
        const newRow = checkRow(col);
        if (turn !== player || values[row][col] !== 'X' || newRow === -1 || gameOver) return;
        socket.emit("move", `${newRow},${col}`);
    }

    function handleGameOver(player: string) {
        setGameOver(player);
    }

    function handleTurn(row: number, col: number) {
        setValues(prevVal => {
            const newValues = prevVal.map(row => row.slice());
            newValues[row][col] = turn;
            setRecentMove(`${row},${col}`);
            calculateWinner(turn, row, col, newValues);
            turn = (turn === "p1" ? "p2" : "p1");
            return newValues;
        });
    }

    function resetGame() {
        let newBoard = emptyBoard.map(row => row.slice());
        setValues(() => newBoard);

        setGameOver(undefined);
        setRecentMove("");
        turn = "p1";
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
            if (values[i][col] === 'X') {
                return i;
            }
        }
        return -1;
    }

    return (
        <>
            <Board values={values} handleClick={handleClick} recent={recentMove} />
            {player === turn ? <p>It is your turn</p> : <p>Waiting for opponent</p>}
            {gameOver && <h1>Winner: {gameOver}</h1>}
            {gameOver && <input type="submit" className="reset" value="New Game" onClick={() => socket.emit("gg", "")} />}
        </>
    );
}

export default Game;