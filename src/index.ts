import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
//import { makeRect } from './tetromino';



class Grid {
	cols: number;
	rows: number;
	length: number;
	constructor(c:number,r:number,l:number) {
		this.cols = c;
		this.rows = r;
		this.length = l;
	}

	public draw(): Graphics {
		let ret: Graphics = new Graphics();
		
		for (let c = 0; c < this.cols; c++) {
			for (let r = 0; r < this.rows; r++) {
				ret.lineStyle(3,0xe1e1e1);
				ret.drawRect(c*this.length, r*this.length, this.length,this.length);
			}
		}

		return ret;
	}

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


//const block = makeRect(100,100,50,50);

const grid: Grid = new Grid(10,20,(window.innerHeight)/22);



conty.addChild(grid.draw());

app.stage.addChild(conty);



