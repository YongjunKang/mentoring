const FRICTION = 0.98;
const MOVE_SPEED = 0.88;

export class Particle {
    constructor(pos, color) {
        this.color = color;
        this.maxRadius = Math.random() * (50 - 20) + 20;

        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;
        this.progress = 0;
        this.radius = 2;
        this.vr = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 10;

        this.fps = 30;
        this.fpsTime = 1000 / this.fps;
    }

    collide() {
        this.rgb = 0xF3361E;
        this.textArr = this.shuffle(this.textArr);
    }

    draw(ctx) {
        if (this.progress < 100) {
            this.vr += (this.maxRadius - this.radius) / this.fpsTime;
            this.vr *= MOVE_SPEED;
        } else {
            this.vr -= 2;
        }

        this.progress += 1;
        this.radius += this.vr;
        this.x += (this.savedX - this.x) * MOVE_SPEED;
        this.y += (this.savedY - this.y) * MOVE_SPEED;

        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        if (this.radius > 1) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }
}