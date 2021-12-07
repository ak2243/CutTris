import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.use(express.static('static'));

import {createServer} from "http";
const httpServer = createServer(app);
const io = new socketio.Server(httpServer);
const port = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./static/index.html"));
});

io.on("connection", function(socket: any) {
  console.log("a user connected");
});

function fall(): void {
  io.emit("fall");
}

var boardUpdate = setInterval(fall, 1000);//Animation timer


httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});