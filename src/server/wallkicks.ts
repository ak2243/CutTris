/*
Wallkicks are a set of alternate positions which a piece checks upon rotation. These
allow for more versatile rotations for all pieces except the line piece, which is weird.

There are different alternate positions depending on how the piece rotated. Positions are checked sequentially. 
Wallkicks are stored in this map. They take a string, with the two numbers representing the start and end rotations.
Wallkicks are stored as vectors, there are four alterante positions for each rotation.
*/

const wallkicks_normal: Map<string,number[][]> = new Map<string,number[][]>([
    ["0,1", [
        [0,-1],
        [-1,-1],
        [2,0],
        [2,-1]]
    ],
    ["1,0", [
        [0,1],
        [1,1],
        [-2,0],
        [-2,1]
    ]],
    ["1,2", [
        [0,1],
        [1,1],
        [-2,0],
        [-2,1]
    ]],
    ["2,1", [
        [0,-1],
        [-1,-1],
        [2,0],
        [2,-1]
    ]],
    ["2,3", [
        [0,1],
        [-1,1],
        [2,0],
        [2,1]
    ]],
    ["3,2", [
        [0,-1],
        [1,-1],
        [-2,0],
        [-2,-1]
    ]],
    ["3,0", [
        [0,-1],
        [1,-1],
        [-2,0],
        [-2,-1]
    ]],
    ["0,3", [
        [0,1],
        [-1,1],
        [2,0],
        [2,1]
    ]]
]);

//Gets the wallkick vectors for the given rotation
export function getWallkickNormal(start:number,end:number):number[][] {
    let s:string = start + "," + end;

    return wallkicks_normal.get(s) as number[][];

}




