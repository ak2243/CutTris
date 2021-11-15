import { Container } from '@pixi/display';
//import { Graphics } from '@pixi/graphics';
import { Application } from 'pixi.js';
import { makeRect } from './tetromino';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

const conty: Container = new Container();

const block = makeRect(100,100,50,50);


conty.addChild(block);
app.stage.addChild(conty);

