export class Keyboard {
    public constructor() {
        // The `.bind(this)` here isn't necesary as these functions won't use `this`!
        document.addEventListener("keydown", Keyboard.keyDown);
        
        document.addEventListener("keyup", Keyboard.keyUp);

    }
    private static keyDown(e: KeyboardEvent): void {
        switch (e.code) {
            case 'Space': 
                console.log("hard drop");
                break;
        }
    }
    private static keyUp(e: KeyboardEvent): void {
        console.log(e.code + "WHY");
    }
}