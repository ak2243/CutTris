import { BagMaker } from "./BagMaker";
import * as Pieces from "./pieces";

export class Logic {
    declare board: number[][];
    declare bagMaker:BagMaker;
    declare centerBlockRow:number;
    declare centerBlockCol:number;
    declare currPiece:Pieces.Tetromino;

    constructor(rows: number, columns: number) {
        this.board = new Array<Array<number>>();
        for( let r:number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for(let c:number = 0; c < columns; c++) {
                this.board[r][c] = 0;
            }
        }

        this.currPiece = new Pieces.ZPiece();
        this.currPiece.rotate(1);
        this.centerBlockRow = 5;
        this.centerBlockCol = 1;
        this.drawCurrPiece();
        this.clearCurrPiece();
        this.currPiece.rotate(2);
        this.drawCurrPiece();
        
        this.bagMaker = new BagMaker(7);
    }


    public clearCurrPiece():void {
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 0;
        });
    }

    public drawCurrPiece():void {
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 7
        });
    }

    public movePiece(right: number, down: number):void {
        this.clearCurrPiece(); // clear current position
        // update piece coordinates
        this.centerBlockCol += right;
        this.centerBlockRow += down;
        console.log(this.centerBlockRow + " " + this.centerBlockCol);
        this.drawCurrPiece(); // redraw
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