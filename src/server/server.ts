import * as express from "express";
import * as socketio from "socket.io";

// Get ip address of machine and port from .env file
const port = +process.env.PORT || 3000;
const ip = process.env.IP || "localhost";

// initialize application
const app = express();
app.use(express.static('static'));


// initialize server
import { createServer } from "http";
import { Logic } from "./logic";
import { Socket } from "socket.io-client";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);

// tell the server where to listen
httpServer.listen(port, () => {
    console.log(`Listening on http://${ip}:${port}`);
});

// Define basic game variables
const linesToWin: number = 40; // need to clear 40 lines to win
// Dimensions of tetris board:
const rows: number = 20;
const columns: number = 10;

// Define player limit (as of now, we can only handle 2 players)
const playerLimit: number = 2;


let activeLogics: Array<Logic> = new Array<Logic>();
// array that keeps track of logic instances for connected users
// when a user disconnects, the value at the index of their logic instance is replaced with a null

let allLogics: Array<Logic> = new Array<Logic>();
// This holds all the logic instances of the game, ignoring (dis)connections

var boardsUpdateTimer; // used to periodically send update board events
var fallTimer; // used to cause tetris pieces to slowly fall (without user input)

function startGame(): void {
    for (let i: number = 0; i < playerLimit; i++) {
        let logic: Logic = new Logic(rows, columns, linesToWin, (victory: boolean) => {
            // put the result into a string
            let result: string = "loss";
            if (victory) {
                result = "win";
            }
            io.emit(result, i);
            // tell the clients who won/lost

            for (let l of allLogics) {
                l.reset()
                // reset game on win/loss
                // tell all clients to reset hold
                // also give a blank array so they can replace the piece with a blank grid of the same size
                io.emit("eraseHold", l.getHoldPiece());
            }
        });
        allLogics.push(logic); // add logic instance to array
        activeLogics.push(null); // connected users replace null with the actual board
    }
    boardsUpdateTimer = setInterval(updateBoards, 20, allLogics);
    // Every 20 milliseconds, socketio sends out update board events
    fallTimer = setInterval(fall, 1000, allLogics);
    // Every second, the current piece falls one unit
}

/**
 * This function is mostly here for convenience.
 * Given an array of Logic objects, return an array with all of their boards (these can then be processed by client)
 * 
 * @param logics the array of logic objects that you would like to get the boards of
 * @returns the boards of all the logic instances
 */
function getBoards(logics: Logic[]): Array<number[][]> {
    let boards:Array<number[][]> = new Array<number[][]>();
    for (let l of logics) {
        boards.push(l.getBoard()); // get board of l
    }
    return boards;
}

// what needs to happen when a user connects
io.on("connection", function (socket: any) {
    var mySocketIndex:number;
    if (allLogics.length == 0) { // this means this is our first connection
        startGame();
    }

    // the user should fill the first null spot in activeLogics
    for (let i: number = 0; i < activeLogics.length; i++) {
        if (activeLogics[i] == null) {
            mySocketIndex = i; // user can take this spot
            break;
        }
    }

    // there might be no open spots in the game if two players have connected
    if (mySocketIndex == undefined) {
        socket.emit("deny");
        return;
    }

    // define logic variables based on the index we jsut got
    activeLogics[mySocketIndex] = allLogics[mySocketIndex];
    let playerLogic: Logic = allLogics[mySocketIndex];

    // Need to tell logic to update the next queue with every piece placement
    playerLogic.setOnPiecePlaced(() => {
        socket.emit("updateNext", playerLogic.getNextPieces());
        // Since this only impacts one client, we need to define it in io.on("connection")
    })

    socket.emit("start", getBoards(allLogics), playerLogic.getHoldPiece(), 
    playerLogic.getNextPieces(), mySocketIndex, linesToWin);

    // set value in array to null if user disconnects
    socket.on("disconnect", () => {
        activeLogics[mySocketIndex] = null;
    })

    // Detect control events sent from client:

    // hard drop
    socket.on("hd", () => {
        playerLogic.movePieceVertical(true);
    });

    // soft drop
    socket.on("sd", () => {
        playerLogic.movePieceVertical(false);
    });

    // rotate piece left
    socket.on("rl", () => {
        playerLogic.rotateLeft();
    });

    // rotate piece right
    socket.on("rr", () => {
        playerLogic.rotateRight();
    });

    // rotate piece 180 (flip)
    socket.on("rf", () => {
        playerLogic.flip();
    });

    // move piece right
    socket.on("mr", () => {
        playerLogic.movePieceHorizontal(true);
    });

    // move piece left
    socket.on("ml", () => {
        playerLogic.movePieceHorizontal(false);
    });

    // swap current piece with hold piece (if allowed)
    socket.on("sh", () => {
        if (playerLogic.swapHold()) {
            socket.emit("updateHold", playerLogic.getHoldPiece());
            // tell client to update hold container to display the new held piece
        }
        // Don't need to tell client anything if no swap hold allowed
    })
});


/**
 * Function that sends update board events to all the clients
 * 
 * @param logics an array of the logic objects for each board
 */
function updateBoards(logics: Logic[]): void {
    let linesToClear: Array<number> = new Array<number>();
    for (let l of logics) {
        linesToClear.push(l.getLinesLeftToClear());
        // so we can tell each client how many more lines they need to clear to win
    }
    io.emit("updateBoard", getBoards(logics), linesToClear);
    // send all the boards and line goals to all the clients
}
/**
 * function that is used to periodially cause current piece to fall across all boards
 * 
 * @param logics an array of all the logic objects in which the pieces should fall
 */
function fall(logics: Logic[]): void { // 
    for (let l of logics) {
        l.movePieceVertical(false);
    }
}
