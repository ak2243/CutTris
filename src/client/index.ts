import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/");

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
conty.y = 30;
app.stage.addChild(conty);

var grid:Graphics;
var holdGrid:Graphics;
var holdBoxMultiplier:number;

var mySocket:number;

socket.on("start", (boards: Array<number[][]>, holdDisplay: number[][], numSocket: number) => {
	mySocket = numSocket;
	let board:number[][] = boards[mySocket];
	grid = drawGrid(board,window.innerHeight / (board.length + 2));
	conty.addChild(grid);

	holdBoxMultiplier = 1 / (board.length + 4);
	let holdGrid = drawGrid(holdDisplay, window.innerHeight * holdBoxMultiplier);
	holdC.addChild(holdGrid);
	holdC.x = conty.x - conty.width - holdC.width;
	holdC.y = 30;

	console.log(holdBoxMultiplier);
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

socket.on("updateHold", (hold:number[][]) => {
	// TODO: help
	holdC.removeChild(holdGrid);
	holdGrid = drawGrid(hold, window.innerHeight * holdBoxMultiplier);
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