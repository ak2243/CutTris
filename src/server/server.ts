import * as express from "express";
import * as socketio from "socket.io";

// Get ip address of machine and port from .env file
const port = +process.env.PORT;
const ip = process.env.IP;

// initialize application
const app = express();
app.use(express.static('static'));


// initialize server
import { createServer } from "http";
import { Logic } from "./logic";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);

// tell the server where to listen
httpServer.listen(port, "0.0.0.0", () => {
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
            }
        });
        allLogics.push(logic); // add logic instance to array
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
 * @returns 
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
    console.log("user connected");

    var mySocketIndex:number;
    if (allLogics.length == 0) { // this means this is our first connection
        startGame();
    }
    // We may not have space for the user.
    // Alternatively, the user might be able to fill the spot of a previously disconnected player.
    if (activeLogics.length >= playerLimit) {
        // First, check if there are any disconnected users 
        for (let i: number = 0; i < activeLogics.length; i++) {
            if (activeLogics[i] == null) {
                mySocketIndex = i; // user can take this spot
                break;
            }
        }
        // if no disconnected users, deny connection request
        if (mySocketIndex == undefined) {
            socket.emit("deny");
            return;
        }
    } else {
        // if this is the first or second connection, we don't 
        mySocketIndex = activeLogics.length;
    }
    activeLogics[mySocketIndex] = allLogics[mySocketIndex];
    let playerLogic: Logic = allLogics[mySocketIndex];

    socket.emit("start", getBoards(allLogics), playerLogic.getHoldPiece(), mySocketIndex, linesToWin);

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