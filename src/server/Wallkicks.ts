const wallkicks_normal: Map<String,number[][]> = new Map<String,number[][]>([
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

export function getWallkickNormal(start:number,end:number):number[][] {
    let s:String = String(start) + "," + String(end);

    return wallkicks_normal.get(s) as number[][];

}




