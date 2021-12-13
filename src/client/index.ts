import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application, defaultVertex } from 'pixi.js';
import { io } from "socket.io-client";

const socket = io();

let margin:number = 30;
let das:number = +process.env.DAS || 133;
let arr:number = +process.env.ARR || 10;

const pieceColors: number[] =
		[0xa1a1a1,//0 = open
			0x2BD4FF,//1 = I
			0x001EFF,//2 = J
			0xFFB10D,//3 = L
			0xE9FF00,//4 = O 
			0xE612FF,//5 = T 
			0x1BC000,//6 = S 
			0xFF3333];//7 = Z

function drawGrid(colorGrid: number[][], length:number): Graphics {	

	let ret: Graphics = new Graphics();

	let rows = colorGrid.length;
	let columns = colorGrid[0].length;


	for (let c = 0; c < columns; c++) {
		for (let r = 0; r < rows; r++) {
			ret.lineStyle(2, 0xc1c1c1);
			ret.beginFill(pieceColors[colorGrid[r][c]])
			ret.drawRect(c * length, r * length, length, length);
			ret.endFill();
		}
	}

	return ret;
}

const app = new Application({
	//@ts-ignore
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x333333,
	width: window.innerWidth,
	height: window.innerHeight
});

const holdC: Container = new Container();
const myBoardC: Container = new Container();
myBoardC.x = (window.innerWidth / 3) - ((10 * window.innerHeight) / 44);
myBoardC.y = margin;
const nextBoardC: Container = new Container();
nextBoardC.x =  (2 * (window.innerWidth / 3)) - ((10 * window.innerHeight) / 44);
nextBoardC.y = margin;
app.stage.addChild(myBoardC, holdC, nextBoardC);

var grid:Graphics;
var nextGrid: Graphics;
var holdGrid:Graphics;
var mySocket:number;
var gridLength:number;
var holdLength:number;
var lineClearGoal:number;
var linesLeftToClear:number;

socket.on("deny", () => {
	alert("A game is in progress, please try again later");
});

socket.on("start", (boards: Array<number[][]>, holdDisplay: number[][], numSocket: number, lineGoal: number) => {
	lineClearGoal = lineGoal;
	mySocket = numSocket;
	let board:number[][] = boards[mySocket];
	gridLength = window.innerHeight / (board.length + 2);
	grid = drawGrid(board, gridLength);
	myBoardC.addChild(grid);

	holdLength = gridLength / 2;
	holdGrid = drawGrid(holdDisplay, holdLength);
	holdC.addChild(holdGrid);
	holdC.x = myBoardC.x - holdC.width - margin;
	holdC.y = myBoardC.y;

	let nextBoard:number[][] = boards[(mySocket + 1) % boards.length];
	// let nextBoard:number[][] = board;
	nextGrid = drawGrid(nextBoard, gridLength);
	nextBoardC.addChild(nextGrid);

	console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
	console.log(mySocket);
	console.log((mySocket + 1) % boards.length);
});

let state: Map<string, boolean> = new Map<string, boolean>();
document.addEventListener("keydown", keyDown);
document.addEventListener("keypress", keyPress);
document.addEventListener("keyup", keyUp);

var arrowRepeat = setInterval(arrowAction, arr);
var pressDownTime:number;

socket.on("updateBoard", (boards:Array<number[][]>, linesLeft:Array<number>) => {
	linesLeftToClear = linesLeft[mySocket];
	let board:number[][] = boards[mySocket];
	myBoardC.removeChild(grid);
	grid = drawGrid(board, gridLength);
	myBoardC.addChild(grid);

	let nextBoard:number[][] = boards[(mySocket + 1) % boards.length];
	nextBoardC.removeChild(nextGrid);
	nextGrid = drawGrid(nextBoard, gridLength);
	nextBoardC.addChild(nextGrid);

});

socket.on("updateHold", (holdDisplay:number[][]) => {
	// TODO: help
	holdC.removeChild(holdGrid);
	holdGrid = drawGrid(holdDisplay, holdLength);
	holdC.addChild(holdGrid);
});

function arrowAction() {
	state.forEach((value, key) => {
		if (value && (Date.now() - pressDownTime > das)) {
			switch (key) {
				case "ArrowRight":
					socket.emit("mr");
					break;
				case "ArrowLeft":
					socket.emit("ml");
					break;
				case "ArrowDown":
					socket.emit("sd");
					break;
			}
		}
	})

}

function keyDown(e: KeyboardEvent): void {
	if(e.repeat) { return; }
	pressDownTime = Date.now();
	state.set(e.code, true);

	switch (e.code) {
		case "ArrowRight":
			socket.emit("mr");
			break;
		case "ArrowLeft":
			socket.emit("ml");
			break;
		case "ArrowDown":
			socket.emit("sd"); // soft drop
			break;
	}

}

function keyPress(e: KeyboardEvent): void {
	switch (e.code) {
		case "KeyZ":
			socket.emit("rl");
			break;
		case "KeyX":
			socket.emit("rr");
			break;
		case "KeyA":
			socket.emit("rf");
			break;
		case "Space":
			socket.emit("hd") // hard drop
			break;
		case "KeyC":
			socket.emit("sh"); // swap hold
			break;
	}
}

function keyUp(e: KeyboardEvent): void {
	state.set(e.code, false);
}

// check for game over
socket.on("loss", (socketNum) => {
	gameEndMessage(socketNum != mySocket);
});

socket.on("win", (socketNum) => {
	gameEndMessage(socketNum == mySocket);
});

function gameEndMessage(victory: boolean): void {
	let alertMsg:string = "defeat :("
	if (victory) {
		alertMsg = "victory :)"
	}
	alert(alertMsg);
}

// After the game ends, the server may reset the game and thus erase the hold piece
socket.on("eraseHold", (blankHold: number[][]) => {
	holdLength = gridLength / 2;
	holdGrid = drawGrid(blankHold, holdLength);
	holdC.addChild(holdGrid);
	holdC.x = myBoardC.x - holdC.width - margin;
	holdC.y = myBoardC.y;
});
