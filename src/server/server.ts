import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.use(express.static('static'));

import {createServer} from "http";
import { Logic } from "./logic";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);
const port = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./static/index.html"));
});

const rows:number = 20;
const columns:number = 10;
let sockets:Array<any> = new Array<any>();
let logicMap:Map<any, Logic> = new Map<any, Logic>();
let fallTimers:Map<any, any> = new Map<any, any>();

let numSockets:number = 0;

io.on("connection", function(socket: any) {
  console.log("a user connected");
  numSockets++;
  let l:Logic = new Logic(rows, columns);
  logicMap.set(socket, l);
  socket.emit("start", l.getBoard(), l.getHoldPiece(), numSockets - 1);
  let fallTimer = setInterval(fall, 1000, l);
  fallTimers.set(socket, fallTimer);

  sockets.push(socket);
});


function updateBoards(): void {
  let boards:Array<number[][]> = new Array<number[][]>();
  logicMap.forEach((value: Logic, key: any) => {
    boards.push(value.getBoard());
  });
  io.emit("updateBoard", boards);
}

function fall(l: Logic): void {
  l.movePieceVertical(false);
}

var boardsUpdateTimer = setInterval(updateBoards, 20);//Animation timer


httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});