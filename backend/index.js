const express = require('express');
const app = express();
const http = require('https');
const fs = require("fs");

const credentials = {
    cert: fs.readFileSync("/etc/letsencrypt/live/tikkikkit21-connect4.chickenkiller.com/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/tikkikkit21-connect4.chickenkiller.com/privkey.pem")
}

const server = http.createServer(credentials, app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let numConnections = 0;
let players = {
    p1: null,
    p2: null
};

app.get('/', (req, res) => {
    res.send('<p>This is the backend server for tikkikkit21\'s connect4 project. You are not supposed to be here...(also zie sucks)</p>');
});

io.on('connection', (socket) => {
    numConnections++;
    console.log(`user connected: [${socket.id}]`);

    let player = null;

    // already two players
    if (numConnections > 2) {
        socket.emit("player", `X`);
    } else {
        player = !players.p1 ? "p1" : "p2";
        players[player] = socket;
        socket.emit("player", player);
        socket.broadcast.emit("join");
    }

    // a player has made a move
    socket.on("move", msg => {
        io.emit("move", msg); 
    });

    // rematch request
    socket.on("rematch", () => {
        socket.broadcast.emit("rematch");
    });

    // reset game
    socket.on("reset", () => {
        players.p1.emit("player", "p2");
        players.p2.emit("player", "p1");

        [players.p2, players.p1] = [players.p1, players.p2];

        io.emit("reset");
    });

    socket.on("disconnect", () => {
        numConnections--;
        if (player) {
            players[player] = null;
        }

        console.log(`user disconnected: [${socket.id}]`);
    });
});

server.listen(1717, () => {
    console.log('listening on *:1717');
});
