import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.use(express.static('static'));

import { createServer } from "http";
import { Logic } from "./logic";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);
const port = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./static/index.html"));
});


httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const rows: number = 20;
const columns: number = 10;
let logicMap: Map<any, Logic> = new Map<any, Logic>();
let fallTimers: Map<any, any> = new Map<any, any>();

let numSockets: number = 0;

io.on("connection", function (socket: any) {
  console.log("a user connected");
  numSockets++;
  let l: Logic = new Logic(rows, columns, (victory: boolean) => {
    io.emit(victory ? "win" : "loss", numSockets - 1);
    // TODO: is the ternary operator ok?
  });
  logicMap.set(socket, l);
  socket.emit("start", l.getBoard(), l.getHoldPiece(), numSockets - 1);
  let fallTimer = setInterval(fall, 1000, l);
  fallTimers.set(socket, fallTimer);

  // Detect controls:
  socket.on("hd", () => {
    l.movePieceVertical(true);
  });

  socket.on("sd", () => {
    l.movePieceVertical(false);
  });

  socket.on("rl", () => {
    l.rotateLeft();
  });

  socket.on("rr", () => {
    l.rotateRight();
  });

  socket.on("rf", () => {
    l.flip();
  });

  socket.on("mr", () => {
    l.movePieceHorizontal(true);
  });

  socket.on("ml", () => {
    l.movePieceHorizontal(false);
  });

  socket.on("sh", () => {
    if (l.swapHold()) {
      socket.emit("updateHold", l.getHoldPiece());
    }
  })

});


function updateBoards(): void {
  let boards: Array<number[][]> = new Array<number[][]>();
  logicMap.forEach((value: Logic, key: any) => {
    boards.push(value.getBoard());
  });
  io.emit("updateBoard", boards);
}

function fall(l: Logic): void {
  l.movePieceVertical(false);
}

var boardsUpdateTimer = setInterval(updateBoards, 20);//Animation timer

// Now, detect controls

logicMap.forEach((value: Logic, key: any) => {
  key.on("hd", () => {
    value.movePieceVertical(true);
  })
});