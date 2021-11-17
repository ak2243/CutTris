export class BagMaker {
    numPieceTypes: number;
    orderedPieces: Array<number>;
    bag: Array<number>;
    index: number;
    constructor(nPT: number) {
        this.numPieceTypes = nPT;
        this.orderedPieces = new Array<number>(nPT);
        for(let i = 0; i < this.numPieceTypes; i++) {
            this.orderedPieces[i] = i;
        }
        this.index = 0;
        this.bag = this.#shuffle(this.orderedPieces);
        console.log(this.orderedPieces)
        console.log(this.bag);
    }

    nextPiece(): number {
        if (this.index >= this.bag.length) {
            this.index = 0;
            this.bag = this.#shuffle(this.orderedPieces);
        }
        return this.bag[this.index++];

    }

    #shuffle(arr: Array<number>): Array<number> {
        let array  = Object.assign([], arr);
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


}