import { Graphics } from '@pixi/graphics';


export interface Tetromino {
    x: number;
    y: number;
    (x: number, y: number): Graphics;
    
}

    
export function makeRect(x: number, y: number, width: number,height: number) {
    const block: Graphics = new Graphics();
    block.beginFill(0xFF0000);
    block.drawRect(x,y,width,height);
    block.endFill();
    return block;
}



