export class BagMaker {
    numPieceTypes: number;
    orderedPieces: Array<number>;
    private bag: Array<number>;
    private index: number;
    public constructor(nPT: number) {
        this.numPieceTypes = nPT;
        this.orderedPieces = new Array<number>(nPT);
        for(let i = 0; i < this.numPieceTypes; i++) {
            this.orderedPieces[i] = i + 1;
        }
        this.index = 0;
        this.bag = this.shuffle(this.orderedPieces);
        console.log(this.orderedPieces)
        console.log(this.bag);
    }

    public nextPiece(): number {
        if (this.index >= this.bag.length) {
            this.index = 0;
            this.bag = this.shuffle(this.orderedPieces);
        }
        this.index++;
        return this.bag[this.index - 1];

    }

    private shuffle(arr: Array<number>): Array<number> {
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