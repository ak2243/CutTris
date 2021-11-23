import { BagMaker } from "./BagMaker";
import * as Pieces from "./pieces";

export class Logic {
    declare board: number[][];
    declare bagMaker: BagMaker;
    declare centerBlockRow: number;
    declare centerBlockCol: number;
    declare currPiece: Pieces.Tetromino;

    constructor(rows: number, columns: number) {
        this.board = new Array<Array<number>>();
        for (let r: number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for (let c: number = 0; c < columns; c++) {
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

        var myTimer = setInterval(this.passiveFalling, 1000);
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
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 7;
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
        let c: number = this.centerBlockCol;
        if (moveRight) {
            c++;
        } else {
            c--;
        }

        let outOfBounds: boolean = false;
        this.currPiece.getLayout().forEach(block => {
            if ((c + block[1] < 0) || (c + block[1] > this.board[0].length - 1)) {
                outOfBounds = true;
            }
        });

        if (!outOfBounds && c != this.centerBlockCol) {
            this.clearCurrPiece();
            this.centerBlockCol = c;
            this.drawCurrPiece();
        }
    }

    public passiveFalling(): void {
        console.log("fall");
        // TODO: get this to actually make it fall
    }

    public movePieceVertical(hardDrop: boolean): void {
        let r: number = this.centerBlockRow;
        if (hardDrop) {
            // TODO: hard drop
            this.clearCurrPiece();
            while(this.checkPiecePosition()) {
                this.centerBlockRow++;
            }
            this.centerBlockRow--;
            this.drawCurrPiece();
            return;

        } else {
            r++;
        }

        let outOfBounds: boolean = false;
        this.currPiece.getLayout().forEach(block => {
            if (r + block[0] > this.board.length - 1) {
                outOfBounds = true;
            }
        });

        // TODO: this is probably the place to check for collisions/placement
        if (!outOfBounds && r != this.centerBlockRow) {
            this.clearCurrPiece();
            this.centerBlockRow = r;
            this.drawCurrPiece();
        }
    }

    public getBoard(): number[][] {
        return this.board;
    }

    newPiece(): boolean {
        let pieceType: number = this.bagMaker.nextPiece();
        //let piece:Pieces.Tetromino = new Pieces.Square;
        switch (pieceType) {

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