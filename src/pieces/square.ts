import { Tetromino } from "./tetromino";

export class Square extends Tetromino {

    override colorCode = 3
    override rotations = [//Square only has one orientation
        [
            [0,0],
            [1,0],
            [0,1],
            [1,1]
        ]
    ]
    constructor() {
        super();
        
    }

    //Ignore rotation for the square, doesn't change anything
    override rotate(amount:number): void {
        return;
    }

}

const s:Square = new Square();