import { BagMaker } from "./bagMaker";
import * as Pieces from "./pieces";

// export function passiveFalling(l: Logic): void {
//     l.movePieceVertical(false);
// }

export class Logic {
    declare private board: number[][];
    declare private bagMaker: BagMaker;
    declare private centerBlockRow: number;
    declare private centerBlockCol: number;
    declare private currPiece: Pieces.Tetromino;
    declare private holdPiece: number;
    declare private rows: number;
    declare private cols: number;
    declare private allowHoldSwap: boolean;
    declare private nextPieces: number[];

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
        this.nextPieces = new Array<number>();
        for(let i = 0; i < 5; i++) {
            this.nextPieces.push(this.bagMaker.nextPiece());
        }
        this.makeNextPiece();
        this.allowHoldSwap = true;

        // var myTimer = setInterval(passiveFalling, 1000, this);
    }

    private getPiece(piece: number): Pieces.Tetromino {
        switch (piece) {
            case 1:
                return new Pieces.Line();
                
            case 2:
                return new Pieces.JPiece();
                
            case 3:
                return new Pieces.LPiece();
                
            case 4:
                return new Pieces.Square();
                
            case 5:
                return new Pieces.TPiece();
               
            case 6:
                return new Pieces.SPiece();
                
            case 7:
                return new Pieces.ZPiece();
            default:
                return new Pieces.Square();

        }
    }

    private makeNextPiece(): void {
        let pieceCode:number = this.nextPieces.shift() as number;
        this.nextPieces.push(this.bagMaker.nextPiece());

        this.currPiece = this.getPiece(pieceCode);
        this.centerBlockRow = 1;
        this.centerBlockCol = 5;
        this.drawCurrPiece();
    }

    private checkPiecePosition(): boolean {//Returns if the block's current position would conflict with any other blocks. 
        //IMPORTANT: This must be run BEFORE drawCurrPiece

        for (let block of this.currPiece.getLayout()) {
            let blockRow = this.centerBlockRow + block[0];
            let blockCol = this.centerBlockCol + block[1];
            if (blockRow < 0 || blockRow >= this.board.length) {//Check if the row is out of bounds
                return false;
            }

            if (blockCol < 0 || blockCol >= this.board[0].length) {//Check if the column is out of bounds
                return false;
            }

            if (this.board[blockRow][blockCol] != 0) {//Check if that square is already occupied
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
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(-1);
        }
        this.drawCurrPiece();
    }

    public rotateLeft(): void {
        this.clearCurrPiece();
        this.currPiece.rotate(-1);
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(1);
        }
        this.drawCurrPiece();
    }

    public flip(): void {
        this.clearCurrPiece();
        this.currPiece.rotate(2)
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(-2);
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
            while (this.checkPiecePosition()) {
                this.centerBlockRow++;
            }
            this.centerBlockRow--;
            this.placePiece();
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

    private placePiece(): void {
        this.drawCurrPiece();
        this.checkClear();
        this.makeNextPiece();
        this.allowHoldSwap = true;
    }

    public swapHold(): void {
        if (this.allowHoldSwap) {
            this.clearCurrPiece();
            if(this.holdPiece == undefined) {
                this.holdPiece = this.currPiece.pieceType;
                this.makeNextPiece();
            } else {
                let swap = this.holdPiece;
                this.holdPiece = this.currPiece.pieceType;
                this.currPiece = this.getPiece(swap);
                this.centerBlockRow = 1;
                this.centerBlockCol = 4;
                this.drawCurrPiece();
            }
            
            this.allowHoldSwap = false;
        }
    }

    public getHoldPiece(): number[][] {
        var ret:number[][] = new Array<Array<number>>();
        for (let r: number = 0; r < 4; r++) {
            ret[r] = new Array<number>();
            for (let c: number = 0; c < 4; c++) {
                ret[r][c] = 0;
            }
        }

        if(this.holdPiece != undefined) {
            let piece:Pieces.Tetromino = this.getPiece(this.holdPiece);

            let row = 1;
            let col = 2;

            for(let block of piece.getLayout()) {
                ret[row + block[0]][col + block[1]] = piece.pieceType;
            }
        }

        return ret;
    }

    public getBoard(): number[][] {
        return this.board;
    }

    public checkClear(): void {
        for (let i = 0; i < this.board.length; i++) {
            let full: boolean = true;
            this.board[i].forEach(element => {
                if (element == 0) {
                    full = false;
                }
            });

            if (full) {
                this.board.splice(i, 1);
                let blankLine: number[] = new Array<number>();
                for (let x = 0; x < this.cols; x++) {
                    blankLine[x] = 0;
                }
                console.log(blankLine);
                this.board.unshift(blankLine);
            }
        }
    }

}