import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application, defaultVertex } from 'pixi.js';
import { io } from "socket.io-client";

const socket = io();

let margin:number = 30;
let das:number = +process.env.DAS || 133;
let arr:number = +process.env.ARR || 10;

const pieceColors: number[] = //Which colors corresponds to which piece
		[0xa1a1a1,//0 = open
			0x2BD4FF,//1 = I
			0x001EFF,//2 = J
			0xFFB10D,//3 = L
			0xE9FF00,//4 = O 
			0xE612FF,//5 = T 
			0x1BC000,//6 = S 
			0xFF3333];//7 = Z

function drawGrid(colorGrid: number[][], length:number): Graphics {	
	/**
	 * Draws a grid based on a logic board. 
	 * @param colorGrid The grid being drawn
	 * @param length The side length of one square
	 */
	let ret: Graphics = new Graphics();

	let rows = colorGrid.length;
	let columns = colorGrid[0].length;


	for (let c = 0; c < columns; c++) {//Draw the board 
		for (let r = 0; r < rows; r++) {
			ret.lineStyle(2, 0xc1c1c1);
			ret.beginFill(pieceColors[colorGrid[r][c]])
			ret.drawRect(c * length, r * length, length, length);
			ret.endFill();
		}
	}

	return ret;
}

const app = new Application({//Make the application with Pixi.js
	//@ts-ignore
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x333333,
	width: window.innerWidth,
	height: window.innerHeight
});

const holdC: Container = new Container();//Container which hold the hold piece
const myBoardC: Container = new Container();//Container which holds the board
myBoardC.x = (window.innerWidth / 3) - ((10 * window.innerHeight) / 44);
myBoardC.y = margin;
const otherBoardC: Container = new Container();//Container which holds the other board
otherBoardC.x =  (2 * (window.innerWidth / 3)) - ((10 * window.innerHeight) / 44);
otherBoardC.y = margin;
const nextC:Container = new Container();//Container which holds the next queue

app.stage.addChild(myBoardC, holdC, otherBoardC,nextC);

var grid:Graphics;//Board
var otherGrid: Graphics;//Other Board
var holdGrid:Graphics;//Held piece graphics
var mySocket:number;//Socket ID
var gridLength:number;//Side length of the board
var holdLength:number;//Side length of the hold board
var lineClearGoal:number;//The number of lines needed to clear
var linesLeftToClear:number;//The number of lines left to clear
var nextGrid: Graphics;//Next piece queue graphics
var nextLength:number;//Side length of the next grid


socket.on("deny", () => {//If someone tries to join a full game
	alert("A game is in progress, please try again later");
});

//Sets up 
socket.on("start", (boards: Array<number[][]>, holdDisplay: number[][], nextPieces: number[][], numSocket: number, lineGoal: number) => {
	lineClearGoal = lineGoal;
	mySocket = numSocket;
	//Draw the board
	let board:number[][] = boards[mySocket];
	gridLength = window.innerHeight / (board.length + 2);
	grid = drawGrid(board, gridLength);
	myBoardC.addChild(grid);
	//Draw the hold box
	holdLength = gridLength / 2;
	holdGrid = drawGrid(holdDisplay, holdLength);
	holdC.addChild(holdGrid);
	holdC.x = myBoardC.x - holdC.width - margin;
	holdC.y = myBoardC.y;

	//Draw the next pieces queue
	nextLength = holdLength;
	nextGrid = drawGrid(nextPieces, nextLength);
	nextC.addChild(nextGrid);
	nextC.x = myBoardC.x + myBoardC.width + margin;
	nextC.y = myBoardC.y;

	//Draw the other board
	let otherBoard:number[][] = boards[(mySocket + 1) % boards.length];
	
	otherGrid = drawGrid(otherBoard, gridLength);
	otherBoardC.addChild(otherGrid);

});

//Set up the keybindings
let state: Map<string, boolean> = new Map<string, boolean>();
document.addEventListener("keydown", keyDown);
document.addEventListener("keypress", keyPress);
document.addEventListener("keyup", keyUp);

//Set up the arrow repeating
setInterval(arrowAction, arr);
var pressDownTime:number;

//Run everytime the board changes
socket.on("updateBoard", (boards:Array<number[][]>, linesLeft:Array<number>) => {
	linesLeftToClear = linesLeft[mySocket];
	let board:number[][] = boards[mySocket];
	//Redraw the board
	myBoardC.removeChild(grid);
	grid = drawGrid(board, gridLength);
	myBoardC.addChild(grid);

	let otherBoard:number[][] = boards[(mySocket + 1) % boards.length];
	//Redraw the other board
	otherBoardC.removeChild(otherGrid);
	otherGrid = drawGrid(otherBoard, gridLength);
	otherBoardC.addChild(otherGrid);

});

socket.on("updateHold", (holdDisplay:number[][]) => {
	// Redraw the hold box
	holdC.removeChild(holdGrid);
	holdGrid = drawGrid(holdDisplay, holdLength);
	holdC.addChild(holdGrid);
});

socket.on("updateNext", (nextQueue:number[][]) => {
	// Redraw the next piece queue
	nextC.removeChild(nextGrid);
	nextGrid = drawGrid(nextQueue, nextLength)
	nextC.addChild(nextGrid);
})

//Run at different speeds depending on the ARR
function arrowAction() {
	state.forEach((value, key) => {
		if (value && (Date.now() - pressDownTime > das)) {
			//Give a buffer between pressing the key and repeating
			switch (key) {
				//Emit the inputs to the server
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

//Detects key presses and handles them
function keyDown(e: KeyboardEvent): void {
	if(e.repeat) { return; }//Skip if the key is being held down, that's handled elsewhere
	pressDownTime = Date.now();//Take the input time, needed for das
	state.set(e.code, true);//Set the key to being held down, will be repeated

	switch (e.code) {//Do each action once before the repeat; this allows for fine adjustments
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

function keyPress(e: KeyboardEvent): void {//These actions don't automatically repeat, so we just handle them here
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

function keyUp(e: KeyboardEvent): void {//Toggle the key off when its released
	state.set(e.code, false);
}

// check for game over
socket.on("loss", (socketNum) => {
	gameEnd(socketNum != mySocket);
});

socket.on("win", (socketNum) => {
	gameEnd(socketNum == mySocket);
});

function gameEnd(victory: boolean): void {
	// Output a message that tells the user (gracefully) if they've won or lost
	let alertMsg:string = "defeat :("
	if (victory) {
		alertMsg = "victory :)"
	}
	alert(alertMsg);

	// Reset key states
	for (let key of state.keys()) {
		state.set(key, false);
	}
}

// After the game ends, the server may reset the game and thus erase the hold piece
socket.on("eraseHold", (blankHold: number[][]) => {
	holdLength = gridLength / 2;
	holdGrid = drawGrid(blankHold, holdLength);
	holdC.addChild(holdGrid);
	holdC.x = myBoardC.x - holdC.width - margin;
	holdC.y = myBoardC.y;
});
