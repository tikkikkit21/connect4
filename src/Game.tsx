import { useEffect, useState, useRef } from 'react';
import Board from './Board';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

import move from './audio/move.mp3';
import win from './audio/win.mp3';
import loss from './audio/loss.wav';

const moveSound = new Audio(move);
const winSound = new Audio(win);
const lossSound = new Audio(loss);

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
    const [win, setWin] = useState<Array<string>>([]);
    const [currMove, setCurrMove] = useState(0);
    const [history, setHistory] = useState<Array<History>>([
        { board: emptyBoard.map(row => row.slice()), recentMove: "" }
    ]);

    const lengthRef = useRef(0);
    lengthRef.current = history.length - 1;

    const playerRef = useRef<string>();
    playerRef.current = player;

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

    function handleGameOver(winner: string, winningMoves: Array<string>) {
        setGameOver(Number(winner[1]));
        setWin(winningMoves);

        if (`p${Number(winner[1])}` === playerRef.current) {
            winSound.play();
        } else {
            lossSound.play();
        }
    }

    function handleTurn(row: number, col: number) {
        moveSound.play();
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
        setWin([]);
        turn = "p1";
        setHistory([{ board: emptyBoard.map(row => row.slice()), recentMove: "" }]);
    }

    // algorithm to check if a move wins the game
    function calculateWinner(movePlayer: string, row: number, col: number, newValues: Array<Array<string>>) {
        // horizontal win
        let winningMoves: Array<string> = [];
        let count = 0;
        for (let i = 0; i < 7; i++) {
            if (newValues[row][i] === movePlayer) {
                count++;
                winningMoves.push(`${row},${i}`);
            } else {
                count = 0;
                winningMoves = [];
            }

            if (count === 4) return handleGameOver(movePlayer, winningMoves);
        }

        // vertical win
        winningMoves = [];
        count = 0;
        for (let i = 0; i < 6; i++) {
            if (newValues[i][col] === movePlayer) {
                count++;
                winningMoves.push(`${i},${col}`);
            } else {
                count = 0;
                winningMoves = [];
            }

            if (count === 4) return handleGameOver(movePlayer, winningMoves);
        }

        // '\' diagonal
        winningMoves = [];
        count = 0;
        let startRow = row > col ? row - col : 0;
        let startCol = col > row ? col - row : 0;

        for (let i = 0; i < Math.min(6 - startRow, 7 - startCol); i++) {
            if (newValues[startRow + i][startCol + i] === movePlayer) {
                winningMoves.push(`${startRow + i},${startCol + i}`);
                count++;
            } else {
                count = 0;
                winningMoves = [];
            }

            if (count === 4) return handleGameOver(movePlayer, winningMoves);
        }

        // '/' diagonal
        winningMoves = [];
        count = 0;
        startRow = row;
        startCol = col;

        while (startRow < 5 && startCol > 0) {
            startRow++;
            startCol--;
        }

        for (let i = 0; i < Math.min(startRow, 7 - startCol); i++) {
            if (newValues[startRow - i][startCol + i] === movePlayer) {
                winningMoves.push(`${startRow - i},${startCol + i}`);
                count++;
            } else {
                count = 0;
                winningMoves = [];
            }

            if (count === 4) return handleGameOver(movePlayer, winningMoves);
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

    const historyDisplay = history.map((_value, move) => {
        return (
            <li key={move}>
                <button onClick={() => setCurrMove(move)}>{"Go to move " + move}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <Board values={history[currMove].board} handleClick={handleClick} recent={history[currMove].recentMove} winningMoves={win} />
            {player === turn ? <p>It is your turn</p> : <p>Waiting for opponent</p>}
            <ol>{historyDisplay}</ol>

            {gameOver > 0 && <h1>Winner: P{gameOver}</h1>}
            {gameOver > 0 &&
                <div className="reset">
                    <input type="submit" className="reset" value="New Game" onClick={() => socket.emit("gg", "")} />
                </div>
            }
        </div>
    );
}

export default Game;