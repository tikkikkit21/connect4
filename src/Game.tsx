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
    const [isWaiting, setIsWaiting] = useState(true);
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
        for (let row = 0; row < 6; row++) {
            if (history[history.length - 1].board[row][col] === 'X') {
                return row;
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

            if (p === "p2") {
                setIsWaiting(false);
            }
        });

        socket.on("gg", () => {
            resetGame();
        });

        socket.on("join", () => {
            console.log("player has joined");
            setIsWaiting(false);
        });
    }, [socket]);

    const historyEntries = history.map((val, i) => {
        if (i === 0) return;
        const [row, col] = val.recentMove.split(",");

        return (
            <div className="history-item">
                <button className="history" onClick={() => setCurrMove(i)}>
                    {`( ${String.fromCharCode(Number(col) + 97)},${Number(row) + 1} )`}
                </button>
            </div>
        );
    });

    return (
        <div className="game">
            <div className="gameboard">
                <Board values={history[currMove].board} handleClick={handleClick} recent={history[currMove].recentMove} winningMoves={win} />
                <p>{`${player === turn ? "It is your turn" : "Waiting for opponent"}${isWaiting ? " (waiting for join)" : ""}`}</p>
                <div className="gameOver">
                    {gameOver > 0 && <h1>Winner: P{gameOver}</h1>}
                    {gameOver > 0 &&
                        <div className="reset">
                            <input type="submit" className="reset" value="New Game" onClick={() => socket.emit("gg", "")} />
                        </div>
                    }
                </div>
            </div>
            <div className="history">
                <div className="history-container">
                    <div className="history-header p1">Player 1</div>
                    <div className="history-header p2">Player 2</div>
                    {historyEntries}
                </div>
            </div>
        </div>
    );
}

export default Game;