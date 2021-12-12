// bagMaker.ts
/**
 * This file houses the BagMaker Class, which randomizes tetrominos using the 7-bag method.
 * 
 * The 7-bag method prevents droughts of certain pieces and excess of others by repeatedly shuffling
 * a 'bag' of seven pieces.
 * 
 * @module
 */
export class BagMaker {
    declare private numPieceTypes: number;
    // in our version of tetris, there are 7 pieces
    declare private orderedPieces: Array<number>;
    // this is the original (un-shuffled) 'bag' that will be cloned and shuffled to generate new 'bags'
    private bag: Array<number>;
    // the current (randomized) bag
    private index: number;

    /**
     * 
     * Initializes the BagMaker instance.
     * 
     * @param nPT the number of piece-types. 7 in nearly every version of tetris
     */
    public constructor(nPT: number) {
        // First, initialize necessary variables using parameter
        this.numPieceTypes = nPT;
        this.orderedPieces = new Array<number>(nPT);

        // create ordered bag so that we can then shuffle it
        for(let i = 0; i < this.numPieceTypes; i++) {
            this.orderedPieces[i] = i + 1;
        }

        this.index = 0; // this will keep track of where in the bag we are
        this.bag = this.shuffle(this.orderedPieces); // generates the (randomized) bag
    }

    /**
     * 
     * @returns the next piece in the bag. If the bag has been used up, it returns the first piece of a new bag.
     */
    public nextPiece(): number {
        // once we exhaust our current bag, we need to make a new one
        if (this.index >= this.bag.length) {
            // make a new bag
            this.bag = this.shuffle(this.orderedPieces);
            // reset index
            this.index = 0;
        }
        // Now, return the next piece in the bag
        this.index++;
        return this.bag[this.index - 1];

    }

    /**
     * Shuffle a given array (can be used to shuffle an ordered bag) 
     * @param arr the array to shuffle
     * @returns the shuffled array
     */
    private shuffle(arr: Array<number>): Array<number> {
        // First, let's clone the array
        let array  = Object.assign([], arr);

        // Now, we randomize the cloned array
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index j
            let j = Math.floor(Math.random() * (i + 1));

            // Switch the array values of i and j
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


}
