import { BagMaker } from "./BagMaker";

class Logic {
    declare board: number[][];
    declare bagMaker:BagMaker;
    declare 

    constructor(rows: number, columns: number) {
        this.board = new Array<Array<number>>();
        for( let r:number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for(let c:number = 0; c < columns; c++) {
                this.board[r][c] = 0;
            }
        }

        this.bagMaker = new BagMaker(7);
    }

    




}