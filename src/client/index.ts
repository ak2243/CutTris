import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application, defaultVertex } from 'pixi.js';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/");

let margin:number = 30;
let das:number = 150;
let arr:number = 50;

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
const conty: Container = new Container();
conty.x = window.innerWidth / 2 - (10 * window.innerHeight) / 44;
conty.y = margin;
app.stage.addChild(conty, holdC);

var grid:Graphics;
var holdGrid:Graphics;
var mySocket:number;
var gridLength:number;
var holdLength:number;

socket.on("start", (boards: Array<number[][]>, holdDisplay: number[][], numSocket: number) => {
	mySocket = numSocket;
	let board:number[][] = boards[mySocket];
	gridLength = window.innerHeight / (board.length + 2);
	grid = drawGrid(board, gridLength);
	conty.addChild(grid);

	holdLength = gridLength / 2;
	holdGrid = drawGrid(holdDisplay, holdLength);
	holdC.addChild(holdGrid);
	holdC.x = conty.x - holdC.width - margin;
	holdC.y = conty.y;
});

let state: Map<string, boolean> = new Map<string, boolean>();
document.addEventListener("keydown", keyDown);
document.addEventListener("keypress", keyPress);
document.addEventListener("keyup", keyUp);

var arrowRepeat = setInterval(arrowAction, arr);
var pressDownTime:number;

socket.on("updateBoard", (boards:Array<number[][]>) => {
	let board:number[][] = boards[mySocket];
	conty.removeChild(grid);
	grid = drawGrid(board, window.innerHeight / (board.length + 2));
	conty.addChild(grid);
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