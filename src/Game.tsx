import { useEffect, useState } from 'react';
import Board from './Board';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type Props = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

function Game({ socket }: Props) {
    const [turn, setTurn] = useState("p1");
    const [values, setValues] = useState([['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
                                          ['X', 'X', 'X', 'X', 'X', 'X', 'X']]);
    const [gameOver, setGameOver] = useState<string>();

    useEffect(() => {
        socket.on("move", (msg: string) => {
            const [player, row, col]: string[] = msg.split(",");

            handleTurn(Number(row), Number(col));
        });
    });

    function handleClick(row: number, col: number): void {
        const newRow = checkRow(col);
        if (values[row][col] !== 'X' || newRow === -1 || gameOver) return;
        socket.emit("move", `${turn},${newRow},${col}`);
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

    // algorithm to check if a move wins the game
    function calculateWinner(player: string, row: number, col: number) {
        // horizontal win
        let count = 0;
        for (let i = 0; i < 7; i++) {
            if (values[row][i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(player);
        }

        // vertical win
        count = 0;
        for (let i = 0; i < 6; i++) {
            if (values[i][col] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(player);
        }

        // '\' diagonal
        count = 0;
        let startRow = row > col ? row - col : 0;
        let startCol = col > row ? col - row : 0;

        for (let i = 0; i < Math.min(6 - startRow, 7 - startCol); i++) {
            if (values[startRow + i][startCol + i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(player);
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
            if (values[startRow - i][startCol + i] === player) {
                count++;
            } else {
                count = 0;
            }

            if (count === 4) return setGameOver(player);
        }
    }

    function handleTurn(row: number, col: number) {
        // update the board
        let newValues = values.slice();
        newValues[row][col] = turn;
        setValues(newValues);

        // send move to other player
        calculateWinner(newValues[row][col], row, col);
        setTurn(turn === "p1" ? "p2" : "p1");
    }

    return (
        <>
            <Board values={values} handleClick={handleClick} />
            {gameOver && <h1>Winner: {gameOver}</h1>}
        </>
    );
}

export default Game;