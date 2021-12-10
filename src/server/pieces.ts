export abstract class Tetromino {
    declare orientation: number;
    declare rotations: number[][][];
    declare pieceType:number;

    constructor() {
        this.orientation = 0;
    }

    getRotation(): number {
        return this.orientation;
    }

    getLayout(): number[][] {
        return this.rotations[this.orientation];
    }
    
    rotate(amount:number): void {//Adding 1 is a clockwise rotation, subtracting 1 is a counter-clockwise rotation
        this.orientation = (this.orientation + amount) % this.rotations.length;
        if(this.orientation < 0) {//Loop back around
            this.orientation += this.rotations.length;
        }
    }

    
}

export class Line extends Tetromino {
    override pieceType = 1

    override rotations = [//Square only has one orientation
        [
            [0,0],
            [0,-2],
            [0,-1],
            [0,1]
        ],
        [
            [-1,0],
            [0,0],
            [1,0],
            [2,0]
        ],
        [
            [1,0],
            [1,-2],
            [1,-1],
            [1,1]
        ],
        [
            [-1,-1],
            [0,-1],
            [1,-1],
            [2,-1]
        ]
        
    ]
    constructor() {
        super();
        
    }
}

export class JPiece extends Tetromino {
    override pieceType = 2;

    override rotations = [//Square only has one orientation
        [
            [0,0],
            [-1,-1],
            [0,-1],
            [0,1]
        ],
        [
            [0,0],
            [-1,1],
            [-1,0],
            [1,0]
        ],
        [
            [0,0],
            [1,1],
            [0,1],
            [0,-1]
        ],
        [
            [0,0],
            [1,-1],
            [1,0],
            [-1,0]
        ]
        
    ]
    constructor() {
        super();
        
    }
}

export class LPiece extends Tetromino {
    override pieceType = 3;

    override rotations = [//Square only has one orientation
        
        [
            [0,0],
            [-1,1],
            [0,1],
            [0,-1]
        ],
        [
            [0,0],
            [1,1],
            [1,0],
            [-1,0]
        ],
        [
            [0,0],
            [1,-1],
            [0,-1],
            [0,1]
        ],
        [
            [0,0],
            [-1,-1],
            [-1,0],
            [1,0]
        ]
        
        
    ]
    constructor() {
        super();
        
    }
}

export class Square extends Tetromino {
    override pieceType = 4

    override rotations = [//Square only has one orientation
        [
            [0,0],
            [-1,0],
            [0,1],
            [-1,1]
        ]
    ]
    constructor() {
        super();
        
    }

    //Ignore rotation for the square, doesn't change anything
    // @ts-ignore
    override rotate(amount:number): void {
        return;
    }

}

export class TPiece extends Tetromino {
    override pieceType = 5;

    override rotations = [//Square only has one orientation
        [
            [0,0],
            [0,-1],
            [0,1],
            [-1,0]
        ],
        [
            [0,0],
            [0,1],
            [-1,0],
            [1,0]
        ],
        [
            [0,0],
            [0,-1],
            [0,1],
            [1,0]
        ],
        [
            [0,0],
            [0,-1],
            [-1,0],
            [1,0]
        ]
        
    ]
    constructor() {
        super();
        
    }
}

export class SPiece extends Tetromino {
    override pieceType = 6;

    override rotations = [//Square only has one orientation
        [
            [0,0],
            [-1,0],
            [-1,1],
            [0,-1]
        ],
        [
            [0,0],
            [0,1],
            [-1,0],
            [1,1]
        ],
        [
            [0,0],
            [1,-1],
            [0,1],
            [1,0]
        ],
        [
            [0,0],
            [-1,-1],
            [0,-1],
            [1,0]
        ]
        
    ]
    constructor() {
        super();
        
    }
}

export class ZPiece extends Tetromino {
    override pieceType = 7;
    
    override rotations = [
        [
            [0,0],
            [-1,0],
            [-1,-1],
            [0,1]
        ],
        [
            [0,0],
            [1,0],
            [0,1],
            [-1,1]
        ],
        [
            [0,0],
            [0,-1],
            [1,1],
            [1,0]
        ],
        [
            [0,0],
            [1,-1],
            [0,-1],
            [-1,0]
        ]
        
    ]
    constructor() {
        super();
        
    }
}