# HTML5 Canvas Tutorial

## 회전하는 도형 만들기

##### Youtube : Interactive Developer [Link](https://www.youtube.com/watch?v=LLfhY4eVwDY)

---

본 클론코딩의 메인 이벤트는 마우스 클릭 및 드래그 따른 도형 회전입니다.

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
    <title>RotatingShape</title>
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
  overflow: hidden;
  background-color: #c5beaf;
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
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // 디바이스의 물리적인 픽셀과 CSS 픽셀의 비율을 반환
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  // 리사이즈 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  }
}

window.onload = () => {
  new App();
};
```

---

### 폴리곤 그리기

```js
/* polygon.js */

const PI2 = Math.PI * 2;

export class Polygon {
  constructor(x, y, radius, sides) {
    this.x = x;
    this.y = y;
    this.radius = radius; // 반지름
    this.sides = sides; // 면,
    this.rotate = 0;
  }

  animate(ctx) {
    ctx.save(); // 캔버스의 모든 상태를 저장한다.
    ctx.fillStyle = '#000';
    ctx.beginPath();

    const angle = PI2 / this.sides; // 각도 정의

    ctx.translate(this.x, this.y);
    // 그리드에서 canvas와 원점을 이동한다.
    // x는 이동시킬 수평 거리
    // y는 그리드에서 수직으로 얼마나 멀리 떨어지는지 정도

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      // i가 0일때 그릴 좌표를 이동하고, 0 이상이면 직선을 그린다.
      i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.fill();
    ctx.closePath();
    ctx.restore(); // 캔버스 상태 복구
  }
}
```

---

### 폴리곤 적용 및 마우스 이벤트 추가

```js
/* app.js */

import { Polygon } from './polygon.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    // 마우스 이벤트 추가
    this.isDown = false; // 눌러진 상태인지 체크
    this.moveX = 0; // 좌우 방향 체크
    this.offsetX = 0; // 움직인 만큼 체크

    document.addEventListener('pointerdown', this.onDown.bind(this), false); // 마우스가 눌렸을 때,
    document.addEventListener('pointermove', this.onMove.bind(this), false); // 마우스를 움직였을 때,
    document.addEventListener('pointerup', this.onUp.bind(this), false); // 마우스를 땠을 때,

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 폴리곤 생성
    this.polygon = new Polygon(
      this.stageWidth / 2, // x 좌표
      this.stageHeight / 2, // y 좌표
      this.stageHeight / 3, // 반지름
      3, // 면의 개수
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.moveX *= 0.92;

    // 폴리곤 생성 및 마우스 이벤트에 따른 moveX 방향 값을 넘김
    this.polygon.animate(this.ctx, this.moveX);
  }

  // 마우스 이벤트 추가
  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.offsetX = e.clientX;
  }

  onMove(e) {
    if (this.isDown) {
      this.moveX = e.clientX - this.offsetX;
      this.offsetX = e.clientX;
    }
  }

  onUp(e) {
    this.isDown = false;
  }
}

// ...
```

---

### 도형 회전 이벤트

```js
/* polygon.js */

// ...

  animate(ctx, moveX) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.beginPath();

    const angle = PI2 / this.sides;

    ctx.translate(this.x, this.y);

    // moveX 값을 참조해 도형 회전 이벤트 변경
    this.rotate -= moveX * 0.008;
    ctx.rotate(this.rotate);

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
```

#### 각 꼭짓점 위치로 도형 그리기

```js
/* polygon.js */

// ...

  animate(ctx, moveX) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.beginPath();

    const angle = PI2 / this.sides;

    ctx.translate(this.x, this.y);

    this.rotate -= moveX * 0.008;
    ctx.rotate(this.rotate);

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      // i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

      // 각 꼭짓점 마다 원을 생성한다.
      // 해당 원은 면의 개수에 따라 수가 달라진다.
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, PI2, false);
      ctx.fill();
    }

    // ctx.fill();
    // ctx.closePath();
    ctx.restore();
  }
}
```

#### 각 꼭짓점 위치로 앨범 형태 그리기

```js
/* polygon.js */

// ...

  animate(ctx, moveX) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.beginPath();

    const angle = PI2 / this.sides;
    const angle2 = PI2 / 4;

    ctx.translate(this.x, this.y);

    this.rotate -= moveX * 0.008;
    ctx.rotate(this.rotate);

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((360 / this.sides) * i + 45) * Math.PI / 180);
      ctx.beginPath();

      for(let j = 0; j < 4; j++) {
        const x2 = 160 * Math.cos(angle2 * j);
        const y2 = 160 * Math.sin(angle2 * j);
        (j == 0) ? ctx.moveTo (x2, y2) : ctx.lineTo(x2, y2);
      }

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    ctx.restore();
  }
}
```

```js
/* app.js */

import { Polygon } from './polygon.js';

class App {
  // ...

  resize() {
    // ...

    // 폴리곤 설정 변경
    this.polygon = new Polygon(
      this.stageWidth / 2,
      this.stageHeight + (this.stageHeight / 4),
      this.stageHeight / 1.5,
      15,
    );
  }

  animte() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.moveX *= 0.92;

    this.polygon.animate(this.ctx, this.moveX);

    // ...
}

// ...
```

#### footer 앨범 형태로 만들기

```js
/* polygon.js */

const COLORS = [
  "#4b45ab",
  "#554fb8",
  "#605ac7",
  "#2a91a8",
  "#2e9ab2",
  "#32a5bf",
  "#81b144",
  "#85b944",
  "#8fc549",
  "#e0af27",
  "#eeba2a",
  "#fec72e",
  "#bf342d",
  "#ca3931",
  "#d7423a",
];

// ...

  animate(ctx, moveX) {
    ctx.save();

    const angle = PI2 / this.sides;
    const angle2 = PI2 / 4;

    ctx.translate(this.x, this.y);

    this.rotate -= moveX * 0.008;
    ctx.rotate(this.rotate);

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      ctx.save();
      ctx.fillStyle = COLORS[i];
      ctx.translate(x, y);
      ctx.rotate(((360 / this.sides) * i + 45) * Math.PI / 180);
      ctx.beginPath();

      for(let j = 0; j < 4; j++) {
        const x2 = 160 * Math.cos(angle2 * j);
        const y2 = 160 * Math.sin(angle2 * j);
        (j == 0) ? ctx.moveTo (x2, y2) : ctx.lineTo(x2, y2);
      }

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    ctx.restore();
  }
}
```
