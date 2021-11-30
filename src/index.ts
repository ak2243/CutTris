import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
import { Logic } from './Logic';

const das:number = 150;

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
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x333333,
	width: window.innerWidth,
	height: window.innerHeight
});



const conty: Container = new Container();
conty.x = window.innerWidth / 2 - (10 * window.innerHeight) / 44;
conty.y = 30;

const logic: Logic = new Logic(20, 10);

let board = logic.getBoard();
let grid: Graphics = drawGrid(board,window.innerHeight / (board.length + 2));
conty.addChild(grid);

const hold: Container = new Container();

let holdDisplay = logic.getHoldPiece();
let holdGrid: Graphics = drawGrid(holdDisplay,window.innerHeight / (board.length + 4));
hold.addChild(holdGrid);
hold.x = conty.x - conty.width/2 - hold.width/2;
hold.y = 30;

app.stage.addChild(conty,hold);

let state: Map<string, boolean> = new Map<string, boolean>();
document.addEventListener("keydown", keyDown);
document.addEventListener("keypress", keyPress);
document.addEventListener("keyup", keyUp);

var myTimer = setInterval(arrowAction, 50);//Animation timer
var date:Date = new Date();

var pressDownTime:number;

function arrowAction() {
	state.forEach((value, key) => {
		if (value) {
			switch (key) {
				case "ArrowRight":
					if(Date.now() - pressDownTime > das) {
						logic.movePieceHorizontal(true);
					}
					break;
				case "ArrowLeft":
					if(Date.now() - pressDownTime > das) {
						logic.movePieceHorizontal(false);
					}
					break;
				// case "Space":
					// logic.movePieceVertical(true);
					// break;
				case "ArrowDown":
					logic.movePieceVertical(false);
					break;
				// case "KeyZ":
					// logic.rotateLeft();
					// break;
				// case "KeyX":
					// logic.rotateRight();
			}
		}
	})
	conty.removeChild(grid);
	board = logic.getBoard();
	grid = drawGrid(logic.getBoard(),window.innerHeight / (board.length + 2));
	conty.addChild(grid);
}

function keyDown(e: KeyboardEvent): void {
	if(e.repeat) { return; }
	pressDownTime = Date.now();
	state.set(e.code, true);

	switch (e.code) {
		case "ArrowRight":
			logic.movePieceHorizontal(true);
			break;
		case "ArrowLeft":
			logic.movePieceHorizontal(false);
			break;
	}

}

function keyPress(e: KeyboardEvent): void {
	switch (e.code) {
		case "KeyZ":
			logic.rotateLeft();
			break;
		case "KeyX":
			logic.rotateRight();
			break;
		case "KeyA":
			logic.flip();
			break;
		case "Space":
			logic.movePieceVertical(true);
			break;
		case "KeyC":
			logic.swapHold();
			hold.removeChild(holdGrid);
			holdDisplay = logic.getHoldPiece();
			holdGrid = drawGrid(holdDisplay,window.innerHeight / (board.length + 4));
			hold.addChild(holdGrid);
			break;
	}
}

function keyUp(e: KeyboardEvent): void {
	state.set(e.code, false);
}