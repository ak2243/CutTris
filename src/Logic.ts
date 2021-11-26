import { BagMaker } from "./BagMaker";
import * as Pieces from "./pieces";

export function passiveFalling(l: Logic): void {
    l.movePieceVertical(false);
}

export class Logic {
    declare board: number[][];
    declare bagMaker: BagMaker;
    declare centerBlockRow: number;
    declare centerBlockCol: number;
    declare currPiece: Pieces.Tetromino;
    declare rows:number;
    declare cols: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.cols = columns;
        this.board = new Array<Array<number>>();
        for (let r: number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for (let c: number = 0; c < columns; c++) {
                this.board[r][c] = 0;
            }
        }

        this.bagMaker = new BagMaker(7);
        this.makeNextPiece();

        var myTimer = setInterval(passiveFalling, 1000, this);
    }

    private makeNextPiece(): void {
        switch (this.bagMaker.nextPiece()) {
            case 1:
                this.currPiece = new Pieces.Line();
                break;
            case 2:
                this.currPiece = new Pieces.JPiece();
                break;
            case 3:
                this.currPiece = new Pieces.LPiece();
                break;
            case 4:
                this.currPiece = new Pieces.Square();
                break;
            case 5:
                this.currPiece = new Pieces.TPiece();
                break;
            case 6:
                this.currPiece = new Pieces.SPiece();
                break;
            case 7:
                this.currPiece = new Pieces.ZPiece();
                break;
        }
        this.centerBlockRow = 1;
        this.centerBlockCol = 4;
        this.drawCurrPiece();
    }

    private checkPiecePosition(): boolean {//Returns if the block's current position would conflict with any other blocks. 
        //IMPORTANT: This must be run BEFORE drawCurrPiece
        
        for(let block of this.currPiece.getLayout()) {
            let blockRow = this.centerBlockRow + block[0];
            let blockCol = this.centerBlockCol + block[1];
            if(blockRow < 0 || blockRow >= this.board.length) {//Check if the row is out of bounds
                return false;
            }

            if(blockCol < 0 || blockCol >= this.board[0].length) {//Check if the column is out of bounds
                return false;
            }

            if(this.board[blockRow][blockCol] != 0) {//Check if that square is already occupied
                return false;
            }
        }
        return true;
    }


    private clearCurrPiece(): void {
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 0;
        });
    }

    private drawCurrPiece(): void {
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = this.currPiece.pieceType;
        });
    }

    public rotateRight(): void {

        this.clearCurrPiece();
        this.currPiece.rotate(1);
        if(!this.checkPiecePosition()) {
            this.currPiece.rotate(-1);
        }
        this.drawCurrPiece();
    }

    public rotateLeft(): void {
        this.clearCurrPiece();
        this.currPiece.rotate(-1);
        if(!this.checkPiecePosition()) {
            this.currPiece.rotate(1);
        }
        this.drawCurrPiece();
    }

    public movePieceHorizontal(moveRight: boolean): void {
        this.clearCurrPiece();
        let c: number = this.centerBlockCol;

        if (moveRight) {
            this.centerBlockCol++;
        } else {
            this.centerBlockCol--;
        }

        if (this.checkPiecePosition()) {
            this.drawCurrPiece();
        } else {
            this.centerBlockCol = c;
            this.drawCurrPiece();
        }
    }

    public movePieceVertical(hardDrop: boolean): void {
        this.clearCurrPiece();
        let r: number = this.centerBlockRow;
        if (hardDrop) {
            while(this.checkPiecePosition()) {
                this.centerBlockRow++;
            }
            this.centerBlockRow--;
            this.drawCurrPiece();
            this.checkClear();
            this.makeNextPiece();
            return;

        } else {
            this.centerBlockRow++;
        }

        // TODO: this is probably the place to check for collisions/placement
        if (this.checkPiecePosition()) {
            this.drawCurrPiece();
        } else {
            this.centerBlockRow = r;
            this.drawCurrPiece();
        }
    }

    public getBoard(): number[][] {
        return this.board;
    }

    public checkClear(): void {
        for (let i = 0; i < this.board.length; i++) {
            let full:boolean = true;
            this.board[i].forEach(element => {
                if (element == 0) {
                    full = false;
                }
            });

            if (full) {
                this.board.splice(i, 1);
                let blankLine:number[] = new Array<number>();
                for (let x = 0; x < this.cols; x++) {
                    blankLine[x] = 0;
                }
                console.log(blankLine);
                this.board.unshift(blankLine);
            }
        }
    }

}