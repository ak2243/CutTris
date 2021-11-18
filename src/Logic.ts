import { BagMaker } from "./BagMaker";
import * as Pieces from "./pieces";

export class Logic {
    declare board: number[][];
    declare bagMaker:BagMaker;
    declare centerBlockRow:number;
    declare centerBlockCol:number;

    constructor(rows: number, columns: number) {
        this.board = new Array<Array<number>>();
        for( let r:number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for(let c:number = 0; c < columns; c++) {
                this.board[r][c] = 0;
            }
        }

        this.centerBlockRow = 7;
        this.centerBlockCol = 3;
        let piece = new Pieces.Square();
        piece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 3
        });

        this.bagMaker = new BagMaker(7);
    }

    public getBoard():number[][] {
        return this.board;
    }

    newPiece():boolean {
        let pieceType:number = this.bagMaker.nextPiece();
        //let piece:Pieces.Tetromino = new Pieces.Square;
        switch(pieceType) {
            
            case 1:
                
            case 2:

            case 3:
                //piece = new Pieces.Square;
                break;
            case 4:

            case 5:

            case 6:

            case 7:

        }

        

        return false;
    }

    




}