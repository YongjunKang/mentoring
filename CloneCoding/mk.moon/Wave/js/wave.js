import {Point} from "./point.js";

export class Wave {
    constructor(index, totalPoints, color) {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.centerX = stageWidth / 2;
        this.centerY = stageHeight / 2;

        this.pointGap = this.stageWidth / (this.totalPoints - 1);

        this.init();
    }

    init() {
        this.points = [];

        for (let i = 0; i < this.totalPoints; i++) {
            this.points[i] = new Point(
                this.index + i,
                this.pointGap * i,
                this.centerY
            );
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        this.prevX = this.points[0].x;
        this.prevY = this.points[0].y;

        ctx.moveTo(this.prevX, this.prevY);

        for (let i = 0; i < this.totalPoints; i++) {
            if (i < this.totalPoints - 1) {
                this.points[i].update();
            }

            const cx = (this.prevX + this.points[i].x) / 2;
            const cy = (this.prevY + this.points[i].y) / 2;

            ctx.quadraticCurveTo(this.prevX, this.prevY, cx, cy);

            this.prevX = this.points[i].x;
            this.prevY = this.points[i].y;
        }

        ctx.lineTo(this.prevX, this.prevY);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();
        ctx.closePath();
    }
}