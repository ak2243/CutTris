import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const port = +process.env.PORT;
const ip = process.env.IP;

const app = express();
app.use(express.static('static'));

import { createServer } from "http";
import { Logic } from "./logic";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);

httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Listening on http://${ip}:${port}`);
});

const linesToWin: number = 4;
const rows: number = 20;
const columns: number = 10;

const playerLimit: number = 2;
let activeLogics: Array<Logic> = new Array<Logic>();
let allLogics: Array<Logic> = new Array<Logic>();

var boardsUpdateTimer;
var fallTimer;

function startGame(): void {
    allLogics = new Array<Logic>();
    activeLogics = new Array<Logic>();
    for (let i: number = 0; i < playerLimit; i++) {
        let logic: Logic = new Logic(rows, columns, linesToWin, (victory: boolean) => {
            let result: string = "loss";
            if (victory) {
                result = "win";
            }
            io.emit(result, i);
        });
        allLogics.push(logic);
    }
    boardsUpdateTimer = setInterval(updateBoards, 20);//Animation timer
    fallTimer = setInterval(fall, 1000, allLogics);
}

function getGraphicalBoards(): Array<number[][]> {
    let boards:Array<number[][]> = new Array<number[][]>();
    for (let l of allLogics) {
        boards.push(l.getBoard());
    }
    return boards;
}

io.on("connection", function (socket: any) {
    var mySocketIndex:number;
    console.log("user connected");
    if (allLogics.length == 0) {
        startGame();
    }
    console.log(activeLogics.length + " " + playerLimit)
    if (activeLogics.length >= playerLimit) {
        // First, check if there are any disconnected users 
        for (let i: number = 0; i < activeLogics.length; i++) {
            if (activeLogics[i] == null) {
                mySocketIndex = i;
                break;
            }
        }
        // if no disconnected users, deny connection request
        if (mySocketIndex == undefined) {
            socket.emit("deny");
            return;
        }
    } else {
        mySocketIndex = activeLogics.length;
    }
    activeLogics[mySocketIndex] = allLogics[mySocketIndex];
    let playerLogic: Logic = allLogics[mySocketIndex];
    console.log(mySocketIndex);


    socket.emit("start", getGraphicalBoards(), playerLogic.getHoldPiece(), mySocketIndex, linesToWin);

    socket.on("disconnect", () => {
        activeLogics[mySocketIndex] = null;
    })

    // Detect controls:
    socket.on("hd", () => {
        playerLogic.movePieceVertical(true);
    });

    socket.on("sd", () => {
        playerLogic.movePieceVertical(false);
    });

    socket.on("rl", () => {
        playerLogic.rotateLeft();
    });

    socket.on("rr", () => {
        playerLogic.rotateRight();
    });

    socket.on("rf", () => {
        playerLogic.flip();
    });

    socket.on("mr", () => {
        playerLogic.movePieceHorizontal(true);
    });

    socket.on("ml", () => {
        playerLogic.movePieceHorizontal(false);
    });

    socket.on("sh", () => {
        if (playerLogic.swapHold()) {
            socket.emit("updateHold", playerLogic.getHoldPiece());
        }
    })
});


function updateBoards(): void {
    let linesToClear: Array<number> = new Array<number>();
    for (let l of allLogics) {
        linesToClear.push(l.getLinesLeftToClear());
    }
    io.emit("updateBoard", getGraphicalBoards(), linesToClear);
}

function fall(logics: Logic[]): void {
    for (let l of logics) {
        l.movePieceVertical(false);
    }
}


// Now, detect controls

// logicMap.forEach((value: Logic, key: any) => {
//     key.on("hd", () => {
//         value.movePieceVertical(true);
//     })
// });