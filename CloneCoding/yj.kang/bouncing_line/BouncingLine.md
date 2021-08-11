# HTML5 Canvas Tutorial

## 줄튕기는 효과 만들기

##### Youtube : Interactive Developer [Link](https://youtu.be/dXhAQbE8iBg)

---

본 클론코딩의 메인 이벤트는 포인터, 공 좌표 위치에 따라 해당 위치에 있는 줄을 튕기는 이벤트 입니다.

### 클론코딩

#### html5

- 기본 템플릿을 정의하고 css 파일과 js 파일을 불러온다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
    />
    <title>BouncingLine</title>
    <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />
  </head>
  <body>
    <script type="module" src="./assets/js/app.js"></script>
  </body>
</html>
```

---

#### CSS

```css
* {
  outline: 0;
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000000;
}

canvas {
  width: 100%;
  height: 100%;
}
```

---

#### Javascript

#### 메인 캔버스 정의

```js
/* app.js */

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  }
}

window.onload = () => {
  new App();
};
```

---

### 줄을 튕기는 포인트 만들기

```js
/* bouncestrings.js */

export class BounceString {
  constructor(pos, color) {
    const middleX = (pos.x2 - pos.x1) / 2 + pos.x1;
    const middleY = (pos.y2 - pos.y1) / 2 + pos.y1;

    this.points = [
      {
        x: pos.x1,
        y: pos.y1,
        ox: pos.x1,
        oy: pos.y1,
        vx: 0,
        vy: 0,
      },
      {
        x: middleX,
        y: middleY,
        ox: middleX,
        oy: middleY,
        vx: 0,
        vy: 0,
      },
      {
        x: pos.x2,
        y: pos.y2,
        ox: pos.x2,
        oy: pos.y2,
        vx: 0,
        vy: 0,
      },
    ];

    this.detect = 10;

    this.color = color;
  }

  animate(ctx, moveX, moveY) {
    ctx.beginPath();
    ctx.fillStyle = '#ff00ff';
    ctx.arc(moveX, moveY, 60, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
```

```js
/* app.js */
import { BounceString } from './bouncestrings.js';

class App {
  constructor() {
    // ...

    // 줄 객체 정의
    this.strings = [];
    this.moveX = -5000;
    this.moveY = -5000;
    this.isDown = false;

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    // 마우스 포인터 이벤트 추가
    document.addEventListener('pointerdown', this.onDown.bind(this), false);
    document.addEventListener('pointermove', this.onMove.bind(this), false);
    document.addEventListener('pointerup', this.onUp.bind(this), false);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // bounce 포인터 생성
    this.strings = [
      new BounceString(
        {
          x1: 50,
          y1: this.stageHeight / 2,
          x2: this.stageWidth - 50,
          y2: this.stageHeight / 2,
        },
        '#ff5038',
      ),
    ];
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    if (this.strings.length > 0) {
      for (let i = 0; i < this.strings.length; i++) {
        this.strings[i].animate(this.ctx, this.moveX, this.moveY);
      }
    }
  }

  onDown(e) {
    // 포인터가 눌렸을 때
    this.isDown = true;
    this.moveX = e.clientX;
    this.moveY = e.clientY;
  }

  onMove(e) {
    // 포인터가 눌려진 상태에서 이동할 때
    if (this.isDown) {
      this.moveX = e.clientX;
      this.moveY = e.clientY;
    }
  }

  onUp(e) {
    // 포인터를 땠을 때 (초기화)
    this.isDown = false;
    this.moveX = -5000;
    this.moveY = -5000;
  }
}

// ...
```

###### 여기까지 만들면 줄을 튕기기 위한 공이 포인터의 이벤트에 따라 생성된다.

---

### bounce 모션 추가

```js
/* bouncestrings.js */
import { lineCircle } from './utils.js';

const BOUNCE = 0.92; // 줄이 튕기는 정도

export class BounceString {
  constructor(pos, color) {
    const middleX = (pos.x2 - pos.x1) / 2 + pos.x1;
    const middleY = (pos.y2 - pos.y1) / 2 + pos.y1;

    this.points = [
      {
        x: pos.x1,
        y: pos.y1,
        ox: pos.x1,
        oy: pos.y1,
        vx: 0,
        vy: 0,
      },
      {
        x: middleX,
        y: middleY,
        ox: middleX,
        oy: middleY,
        vx: 0,
        vy: 0,
      },
      {
        x: pos.x2,
        y: pos.y2,
        ox: pos.x2,
        oy: pos.y2,
        vx: 0,
        vy: 0,
      },
    ];

    this.detect = 10;

    this.color = color;
  }

  animate(ctx, moveX, moveY) {
    ctx.beginPath();
    ctx.fillStyle = '#ff00ff';
    ctx.arc(moveX, moveY, 60, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;

    if (
      lineCircle(
        this.points[0].x,
        this.points[0].y,
        this.points[2].x,
        this.points[2].y,
        moveX,
        moveY,
        this.detect,
      )
    ) {
      this.detect = 300; // 줄이 튕기는 깊이
      let tx = (this.points[1].ox + moveX) / 2;
      let ty = moveY;
      this.points[1].vx = tx - this.points[1].x;
      this.points[1].vy = ty - this.points[1].y;
    } else {
      this.detect = 10;
      let tx = this.points[1].ox;
      let ty = this.points[1].oy;
      this.points[1].vx += tx - this.points[1].x;
      this.points[1].vy *= BOUNCE;
      this.points[1].vy += ty - this.points[1].y;
      this.points[1].vy *= BOUNCE;
    }

    this.points[1].x += this.points[1].vx;
    this.points[1].y += this.points[1].vy;

    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    ctx.moveTo(prevX, prevY);

    for (let i = 0; i < this.points.length; i++) {
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    ctx.lineTo(prevX, prevY);
    ctx.stroke();
  }
}
```

```js
/* utils.js */

export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

export function lineCircle(x1, y1, x2, y2, cx, cy, r) {
  const lineLength = distance(x1, y1, x2, y2);
  const point =
    ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(lineLength, 2); // 주어진 밑 값을 주어진 지수 값으로 거듭제곱한 숫자 값.

  const px = x1 + point * (x2 - x1);
  const py = y1 + point * (y2 - y1);

  if (distance(px, py, cx, cy) < r) {
    return true;
  } else {
    return false;
  }
}
```

###### 여기 까지 만들면 중앙에 줄이 하나 생기고 마우스 포인터를 눌렀을 때 추가되는 공을 튕기면 `quadraticCurveTo` 함수로 인해 곡선을 그리며 튕기는 모습을 볼 수 있다.

---

## 여러개의 줄 추가하기

```js
/* app.js */
import { BounceString } from './bouncestrings.js';

class App {
  constructor() {
    // ...
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 줄 간격 정의
    const xGap = 20;
    const yGap = 20;
    const x1 = xGap;
    const x2 = this.stageWidth - xGap;
    const total = Math.floor((this.stageHeight - yGap) / yGap);

    this.strings = [];

    for(let i = 0; i < total; i++ ) {
      this.strings[i] = new BounceString(
        {
          x1: x1,
          y1: i * yGap + yGap,
          x2: x2,
          y2: i + yGap + yGap,
        },
        '#ff5038',
      );
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    if (this.strings.length > 0) {
      for (let i = 0; i < this.strings.length; i++) {
        this.strings[i].animate(this.ctx, this, moveX, this.moveY);
      }
    }
  }

// ...
```

###### 여기까지 하면 화면에 여러줄이 등장하고 포인터 이벤트에 따라 튕기는 모습을 볼 수 있다.

---

### 줄을 튕겨주는 공 만들기

```js
/* ball.js */

const PI2 = Math.PI * 2;

export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    this.radius = radius;
    this.vx = speed;
    this.vy = speed;
    this.x = stageWidth / 2;
    this.y = stageHeight / 2;
  }

  animate(ctx, stageWidth, stageHeight) {
    this.x += this.vx;
    this.y += this.vy;

    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
    }

    if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1;
    }

    ctx.fillStyle = '#ffdd1c';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fill();
  }
}
```

```js
/* app.js */
import { BounceString } from './bouncestrings.js';
import { Ball } from './ball.js';

class App {
  constructor() {
    // ...

    this.resize();

    // 공 객체 생성
    this.ball = new Ball(this.stageWidth, this.stageHeight, 70, 6);

    // ...
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 줄 간격 정의
    const xGap = 20;
    const yGap = 20;
    const x1 = xGap;
    const x2 = this.stageWidth - xGap;
    const total = Math.floor((this.stageHeight - yGap) / yGap);

    this.strings = [];

    for(let i = 0; i < total; i++ ) {
      this.strings[i] = new BounceString(
        {
          x1: x1,
          y1: i * yGap + yGap,
          x2: x2,
          y2: i + yGap + yGap,
        },
        '#ff5038',
      ),
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    if (this.strings.length > 0) {
      for (let i = 0; i < this.strings.length; i++) {
        // this.strings[i].animate(this.ctx, this, moveX, this.moveY);
        this.strings[i].animate(this.ctx, this.ball.x, this.ball.y);
        // 해당 이벤트의 좌표값을 Ball의 좌표값으로 인자를 넘길 시 공이 이동할때 마다 자동으로 줄이 튕기게 된다.
      }
    }

    // 공 애니메이션 추가
    this.ball.animate(this.ctx, this.stageWidth, this.stageHeight);
  }

// ...
```
