export abstract class Tetromino {
    declare orientation: number;
    declare rotations: number[][][];
    declare colorCode: number;//Logical code used to represent this kind of piece

    constructor() {
        this.orientation = 0;
    }

    getLayout(): number[][] {
        return this.rotations[this.orientation];
    }
    
    rotate(amount:number): void {//Adding 1 is a clockwise rotation, subtracting 1 is a counter-clockwise rotation
        this.orientation += amount;
        if(this.orientation < 0) {//Loop back around
            this.orientation += this.rotations.length;
        }
    }
}


    




