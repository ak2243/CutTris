import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
import { Logic } from './Logic';

function drawGrid(colorGrid: number[][]) : Graphics{

	const pieceColors: number[] = 
		[0xa1a1a1,//0 = open
		0x2BD4FF,//1 = I
		0x001EFF,//2 = J
		0xFFB10D,//3 = L
		0xE9FF00,//4 = O 
		0xE612FF,//5 = T 
		0x1BC000,//6 = S 
		0xFF2B09];//7 = Z

	let ret: Graphics = new Graphics();

	let rows = colorGrid.length;
	let columns = colorGrid[0].length;
	let length = window.innerHeight / (rows + 2);

	for (let c = 0; c < columns; c++) {
		for (let r = 0; r < rows; r++) {
			ret.lineStyle(3,0xc1c1c1);
			ret.beginFill(pieceColors[colorGrid[r][c]])
			ret.drawRect(c*length, r*length, length,length);
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
conty.x = window.innerWidth/2 - (10*window.innerHeight)/44;
conty.y = 30;

const logic:Logic = new Logic(20,10);

// let colors : number[][] = //Representation for the board
// [[0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,5,0,0,0,0,0],
//  [0,0,0,5,5,5,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,4,4,0,0,0],
//  [0,0,0,0,0,4,4,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0], 
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,0,0,0,0,0,0,0,0,0],
//  [0,2,0,0,0,0,0,0,0,0],
//  [0,2,2,2,0,1,1,1,1,0]];

conty.addChild(drawGrid(logic.getBoard()));

app.stage.addChild(conty);



