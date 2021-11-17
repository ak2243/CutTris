import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
//import { makeRect } from './tetromino';

function drawGrid(rows:number, columns: number, length:number, colorGrid: number[][]) : Graphics{

	const pieceColors: number[] = [0xd1d1d1,//0 = open
		0x2BD4FF,//1 = I
		0x001EFF,//2 = J
		0xFFB10D,//3 = L
		0xE9FF00,//4 = O 
		0xE612FF,//5 = T 
		0x1BC000,//6 = S 
		0xFF2B09];//7 = Z

	let ret: Graphics = new Graphics();

		
	for (let c = 0; c < columns; c++) {
		for (let r = 0; r < rows; r++) {
			ret.lineStyle(3,0xe1e1e1);
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

let colors : number[][] = //Representation for the board
[[0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,5,0,0,0,0,0],
 [0,0,0,5,5,5,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0], 
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,1,1,0]];

conty.addChild(drawGrid(20,10,(window.innerHeight)/22,colors));

app.stage.addChild(conty);



