import { BagMaker } from "./bagMaker";
import * as Pieces from "./pieces";
import {getWallkickNormal} from "./wallkicks";

export class Logic {
    /**
     * Logic class which handles all gameplay logic, including
     * movement, collisions, and line clearing
     * @author Peter Timpane, Arjun Khanna
     */

    declare private board: number[][];// The board
    declare private bagMaker: BagMaker;// Special randomizer, gives the piece order
    declare private centerBlockRow: number;//The row the center block is in
    declare private centerBlockCol: number;//The column the center block is in
    declare private currPiece: Pieces.Tetromino;// The current piece
    declare private holdPiece: number;// The piece being held, stored as a number
    declare private rows: number;//How many rows in the board
    declare private cols: number;//How many columns in the board
    declare private allowHoldSwap: boolean;//Whether or not the player is allowed to swap
    declare private nextPieces: number[];//The next 5 pieces
    declare private gameOver: Function;//The function to run when the game is over
    declare private linesToWin: number;//How many lines need to be cleared for the game to be over

    constructor(rows: number, columns: number, linesToWin:number, gameOver: Function) {
        /**
         * Constructor, assigns and initializes all necessary variables and creates the board
         * @param rows The number of rows in the board
         * @param columns The number of columns in the board
         * @param linesToWin How many lines a player needs to clear to win
         * @param gameOver The function which is run when the game is over
         */
        this.linesToWin = linesToWin;
        this.rows = rows;
        this.cols = columns;
        this.gameOver = gameOver;
        this.board = new Array<Array<number>>();
        //Create the board, every space is zero
        for (let r: number = 0; r < rows; r++) {
            this.board[r] = new Array<number>();
            for (let c: number = 0; c < columns; c++) {
                this.board[r][c] = 0;
            }
        }

        //Creates the randomizer
        this.bagMaker = new BagMaker(7);
        //Gets the first five pieces, fills the nextPiece queue
        this.nextPieces = new Array<number>();
        for (let i = 0; i < 5; i++) {
            this.nextPieces.push(this.bagMaker.nextPiece());
        }

        //Start the game
        this.makeNextPiece();
        this.allowHoldSwap = true;

    }

    public getLinesLeftToClear(): number {
        return this.linesToWin;
    }

    private getPiece(piece: number): Pieces.Tetromino {
        /**
         * Given the numerical code, get the piece. Pieces are stored in logic as
         * a number from 1 to 7, each corresponding to a specific piece
         * @returns The piece which corresponds to the numerical code
         */
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
            default://Default is square, this should never be run
                return new Pieces.Square();

        }
    }

    private makeNextPiece(): void {
        /**
         * The function run every time a new piece is placed.
         * Also checks for if the player has topped out
         */


        //Shift and push are queue functionality built into lists
        //Shift returns a number or undefined, so we use 'as' to make sure its a number
        let pieceCode: number = this.nextPieces.shift() as number;
        this.nextPieces.push(this.bagMaker.nextPiece());

        //Get the next piece, reset the piece position
        this.currPiece = this.getPiece(pieceCode);
        this.centerBlockRow = 1;
        this.centerBlockCol = 5;

        //Check if the block is colliding with another block. If yes, the player has topped out, so game over
        if(!this.checkPiecePosition()) {
            this.gameOver(false);
        }

        //Draw the piece
        this.drawCurrPiece();
    }

    private checkPiecePosition(): boolean {
        /**
         * Returns if the block's current position would conflict with any other blocks.
         *  @returns true if not conflicting, false otherwise
         * 
         */ 
        //IMPORTANT: This must be run BEFORE drawCurrPiece

        for (let block of this.currPiece.getLayout()) {
            //Check every individual piece of the piece, see if any conflicts
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
        /**
         * Undraws the piece on the board
         * Used for all movements
         * See pieces.ts for clarification on how pieces are stored
         */
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = 0;
        });
    }

    private drawCurrPiece(): void {
        /**
         * Draws the current piece on the board.
         * Used for basically everything
         * See pieces.ts for clarification on how pieces are stored
         */
        this.currPiece.getLayout().forEach(block => {
            this.board[this.centerBlockRow + block[0]][this.centerBlockCol + block[1]] = this.currPiece.pieceType;
        });
    }

    public rotateRight(): void {
        /**
         * Rotate the piece right, or clockwise
         * Also applies wallkicks to all pieces except the Line and Square piece
         */
        this.clearCurrPiece();
        //Rotate the current piece clockwise, storing the current and desired rotation
        //These are necessary for wallkicks
        let rotation = this.currPiece.getRotation();
        this.currPiece.rotate(1);
        let desiredRotation = this.currPiece.getRotation();
        
        //Squares and Lines can't wallkick, only do wallkicks if necessary
        if(this.currPiece.pieceType != 1 && this.currPiece.pieceType != 4 && !this.checkPiecePosition()) {
            //See Wallkicks.ts for more information on wallkicks
            //Checks every wallkick vector for one which works
            let wKicks = getWallkickNormal(rotation, desiredRotation);
            for(let position of wKicks) {
                //Check the potential position for collisions
                this.centerBlockRow += position[0];
                this.centerBlockCol += position[1];
                if(this.checkPiecePosition()) {
                    break;
                }
                this.centerBlockRow -= position[0];
                this.centerBlockCol -= position[1];
            }
        }

        //Check the piece position, and if it still conflicts just undo the rotation
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(-1);
        }
        this.drawCurrPiece();
    }

    public rotateLeft(): void {
         /**
         * Rotate the piece right, or clockwise
         * Also applies wallkicks to all pieces except the Line and Square piece
         */
        this.clearCurrPiece();
        //Rotate the current piece clockwise, storing the current and desired rotation
        //These are necessary for wallkicks
        let rotation = this.currPiece.getRotation();
        this.currPiece.rotate(-1);
        let desiredRotation = this.currPiece.getRotation();
        
        
        //Squares and Lines can't wallkick, only do wallkicks if necessary
        if(this.currPiece.pieceType != 1 && this.currPiece.pieceType != 4 && !this.checkPiecePosition()) {
            //See Wallkicks.ts for more information on wallkicks
            //Checks every wallkick vector for one which works
            let wKicks:number[][] = getWallkickNormal(rotation, desiredRotation);
            for(let position of wKicks) {
                //Check the potential position for collisions
                this.centerBlockRow += position[0];
                this.centerBlockCol += position[1];
                if(this.checkPiecePosition()) {
                    break;
                }
                this.centerBlockRow -= position[0];
                this.centerBlockCol -= position[1];
            }
        }

        //If the position still conflicts, undo the rotation
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(1);
        }
        this.drawCurrPiece();
    }

    public flip(): void {
        /**
         * Flip the piece 180 degrees. No wallkicks
         */
        this.clearCurrPiece();
        this.currPiece.rotate(2)
        //If the position is invalid, undo the rotation
        if (!this.checkPiecePosition()) {
            this.currPiece.rotate(-2);
        }
        this.drawCurrPiece();
    }

    public movePieceHorizontal(moveRight: boolean): void {
        /**
         * Moves the piece horizontally
         * @param moveRight Whether or not the movement is right or left.
         */
        this.clearCurrPiece();
        let c: number = this.centerBlockCol;

        if (moveRight) {
            this.centerBlockCol++;
        } else {
            this.centerBlockCol--;
        }

        //Undo the movement if the resulting position is invalid
        if (this.checkPiecePosition()) {
            this.drawCurrPiece();
        } else {
            this.centerBlockCol = c;
            this.drawCurrPiece();
        }
    }

    public movePieceVertical(hardDrop: boolean): void {
        /**
         * Move the piece vertically. Pieces can only move downwards
         * @param hardDrop Whether or not the movement is a harddrop
         */
        this.clearCurrPiece();
        let r: number = this.centerBlockRow;
        //If a harddrop, move the piece downwards until it hits something
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

        //Check the current position, undo movement if it doesn't work.
        //Only matters for soft drop
        if (this.checkPiecePosition()) {
            this.drawCurrPiece();
        } else {
            this.centerBlockRow = r;
            this.drawCurrPiece();
        }
    }

    private placePiece(): void {
        //Function run when a piece is placed. Draws the piece, changes the current piece, and checks for any line clears
        this.drawCurrPiece();
        this.checkClear();
        this.makeNextPiece();
        this.allowHoldSwap = true;

        //If the lines have been cleared, they win!
        if (this.linesToWin <= 0) {
            this.gameOver(true);
        }
    }

    public swapHold(): boolean {
        /**
         * Swap the current piece for the held piece
         * @returns true if the swap was successful, false otherwise
         */
        if (this.allowHoldSwap) {//Only run if the player can swap.
            //Players are only allowed to swap once per piece
            this.clearCurrPiece();
            //If this is the first held piece, just hold the curr piece and use the next piece
            if (this.holdPiece == undefined) {
                this.holdPiece = this.currPiece.pieceType;
                this.makeNextPiece();
            } else {
                //Swap the held and current pieces, reset the piece to the starting position
                let swap = this.holdPiece;
                this.holdPiece = this.currPiece.pieceType;
                this.currPiece = this.getPiece(swap);
                this.centerBlockRow = 1;
                this.centerBlockCol = 5;
                this.drawCurrPiece();
            }

            this.allowHoldSwap = false;
            return true;
        }
        return false;
    }

    public getHoldPiece(): number[][] {
        /**
         * Get the held piece in a 4x4 board. 
         * @returns A 4x4 list which has the piece drawn in it numerically
         */
        var ret: number[][] = new Array<Array<number>>();
        for (let r: number = 0; r < 4; r++) {
            ret[r] = new Array<number>();
            for (let c: number = 0; c < 4; c++) {
                ret[r][c] = 0;
            }
        }

        //Only fill it in the board if a piece is held
        if (this.holdPiece != undefined) {
            let piece: Pieces.Tetromino = this.getPiece(this.holdPiece);

            //Draw from row 2 columns 2, zero indexed
            let row = 2;
            let col = 2;

            for (let block of piece.getLayout()) {
                ret[row + block[0]][col + block[1]] = piece.pieceType;
            }
        }

        return ret;
    }

    public getBoard(): number[][] {
        /**
         * Get the current board
         * @returns The board
         */
        return this.board;
    }

    private checkClear(): void {
        /**
         * Check if any lines have been cleared, clear those lines, and adjust linesToWin accordingly
         */
        for (let i = 0; i < this.board.length; i++) {
            let full: boolean = true;
            //Check if each fow is full
            this.board[i].forEach(element => {
                if (element == 0) {
                    full = false;
                }
            });

            if (full) {
                //Clear the line
                this.board.splice(i, 1);
                let blankLine: number[] = new Array<number>();
                for (let x = 0; x < this.cols; x++) {
                    blankLine[x] = 0;
                }
                console.log(blankLine);
                this.board.unshift(blankLine);
                this.linesToWin--;
            }
        }
    }

}
