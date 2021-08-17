import {Text} from "./text.js";
import {BounceString} from "./bouncestring.js";

export class Visual {
    constructor() {
        this.text = new Text();

        this.strings = [];
        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };

        document.addEventListener("pointermove", this.onMove.bind(this));
    }

    onMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    show(stageWidth, stageHeight) {
        this.pos = this.text.setText("M", 5, stageWidth, stageHeight);

        this.strings = [];
        for (let i = 0; i < this.pos.outline.length; i++) {
            this.strings[i] = new BounceString({
                x1: this.pos.outline[i].x,
                y1: this.pos.outline[i].minY,
                x2: this.pos.outline[i].x,
                y2: this.pos.outline[i].maxY
            });
        }
    }

    animate(ctx, t) {
        for (let i = 0; i < this.strings.length; i++) {
            this.strings[i].animate(ctx, this.mouse.x, this.mouse.y);
        }
    }
}