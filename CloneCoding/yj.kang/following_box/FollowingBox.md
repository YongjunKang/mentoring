# HTML5 Canvas Tutorial

## 줄에 매달려 흔들리는 상자 만들기

##### Youtube : Interactive Developer [Link](https://youtu.be/XNxkVVK6m80)

---

본 클론코딩의 메인 이벤트는 포인터 위치에 연결된 줄을 통해 흔들리며 따라오는 상자입니다.

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
    <title>FollowingBox</title>
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
  background-color: #3de1f5;
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

### 포인트 만들기

```js
/* point.js */

export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // 포인터 추가
  add(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  // 포인터 감소
  subtract(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  // 포인터 곱
  reduce(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  // 포인터 충돌 관련 함수
  collide(point, width, height) {
    if (
      this.x >= point.x &&
      this.x <= point.x + width &&
      this.y >= point.y &&
      this.y <= point.y + height
    ) {
      return true;
    } else {
      return false;
    }
  }

  clone() {
    // 클론 함수는 새로운 포인터 객체를 반환한다.
    return new Point(this.x, this.y);
  }
}
```

```js
/* app.js */
import { Point } from './point.js';

class App {
  constructor() {
    // ...

    this.mousePos = new Point();
    this.curItem = null;

    window.requestAnimationFrame(this.animate.bind(this));

    // 마우스 포인터 이벤트 추가
    document.addEventListener('pointerdown', this.onDown.bind(this), false);
    document.addEventListener('pointermove', this.onMove.bind(this), false);
    document.addEventListener('pointerup', this.onUp.bind(this), false);
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

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;
  }

  onUp(e) {}
}

window.onload = () => {
  new App();
};
```

---

### 상자 만들기

```js
/* dialog.js */

import { Point } from './point.js';

// 상자 애니메이션, 생성을 위한 설정 값
const FOLLOW_SPEED = 0.08;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const FPS = 1000 / 60;
const WIDTH = 260;
const HEIGHT = 260;

export class Dialog {
  constructor() {
    // 객체 초기화 및 생성
    this.pos = new Point();
    this.target = new Point();
    this.prevPos = new Point();
    this.downPos = new Point();
    this.startPos = new Point();
    this.mousePos = new Point();
    this.centerPos = new Point();
    this.origin = new Point();
    this.rotation = 0;
    this.sideValue = 0;
    this.isDown = false;
  }

  // 화면 크기 변경시, 상자, 이전 좌표, x,y 좌표를 변경한다.
  resize(stageWidth, stageHeight) {
    this.pos.x = Math.random() * (stageWidth - WIDTH);
    this.pos.y = Math.random() * (stageHeight - HEIGHT);
    this.target = this.pos.clone();
    this.prevPos = this.pos.clone();
  }

  animate(ctx) {
    // 상자를 옮기는 이벤트 때 사용
    const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPEED);
    this.pos.add(move);

    // 상자와 마우스 포인터에 줄 연결 이벤트때 사용
    this.centerPos = this.pos.clone().add(this.mousePos);

    ctx.beginPath();
    ctx.fillStyle = '#f4e55a';
    ctx.fillRect(this.pos.x, this.pos.y, WIDTH, HEIGHT);
  }

  down(point) {
    // 포인터와 다이얼로그 충돌 확인
    if (point.collide(this.pos, WIDTH, HEIGHT)) {
      this.isDown = true;
      this.startPos = this.pos.clone();
      this.downPos = point.clone();
      this.mousePos = point.clone().subtract(this.pos); // 새로 생성된 포인터에서 현재 위치를 뺀값

      return this;
    } else {
      return null;
    }
  }

  move(point) {
    if (this.isDown) {
      this.target = this.startPos.clone().add(point).subtract(this.downPos);
    }
  }

  up() {
    this.isDown = false;
  }
}
```

---

### 상자 화면에 그리기

```js
/* app.js */
import { Point } from './point.js';
import { Dialog } from './dialog.js';

class App {
  constructor() {
    // ...

    this.mousePos = new Point();
    this.curItem = null;

    // 상자 객체 생성
    this.items = []; // 상자 객체가 담길 배열
    this.total = 1; // 상자 수
    for (let i = 0; i < this.total; i++) {
      this.items[i] = new Dialog();
    }

    window.requestAnimationFrame(this.animate.bind(this));

    // ...
  }

  resize() {
    // ...
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 그림자 설정
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = `rgba(0,0,0,0.1)`;

    // 라인 두께 설정
    this.ctx.lineWidth = 2;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate() {
    //...
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 상자 그리기
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].animate(this.ctx);
    }
  }

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i].down(this.mousePos.clone());
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]);
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].up();
    }
  }
}

window.onload = () => {
  new App();
};
```

---

### 상자와 포인터에 줄 연결 애니메이션 추가

```js
/* app.js */
import { Point } from './point.js';
import { Dialog } from './dialog.js';

class App {
  constructor() {
    // ...
  }

  resize() {
    // ...

    // 그림자 설정
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = y;
    this.ctx.shadowColor = `rgba(0,0,0,0.1)`;

    // 라인 두께 설정
    this.ctx.lineWidth = 2;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate() {
    //...
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 상자 애니메이션
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].animate(this.ctx);
    }

    // 상자의 눌린 위치에 원으로 표시
    if (this.curItem) {
      this.ctx.fillStyle = '#ff4338';
      this.ctx.strokeStyle = '#ff4338';

      this.ctx.beginPath();
      this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI * 2, false);
      this.ctx.fill();

      // 마우스 포인터 위치에 원으로 표시
      this.ctx.beginPath();
      this.ctx.arc(
        this.curItem.centerPos.x,
        this.curItem.centerPos.y,
        8,
        0,
        Math.PI * 2,
        false,
      );
      this.ctx.fill();

      // 마우스 포인터 원과 상자 원을 줄로 연결
      this.ctx.beginPath();
      this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
      this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
      this.ctx.stroke();
    }
  }

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i].down(this.mousePos.cloen());
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]);
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].up();
    }
  }
}

window.onload = () => {
  new App();
};
```

---

### 스윙 모션 추가하기

```js
/* dialog.js */

import { Point } from './point.js';

//...

export class Dialog {
  constructor() {
    // ...
  }

  resize(stageWidth, stageHeight) {
    // ...
  }

  animate(ctx) {
    const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPPED);
    this.pos.add(move);

    this.centerPos = this.pos.clone().add(this.mousePos);

    // 스윙 모션 추가
    this.swingDrag(ctx);
    this.prevPos = this.pos.clone();
  }

  // 스윙 모션 추가
  swingDrag(ctx) {
    const dx = this.pos.x - this.prevPos.x;
    const speedX = Math.abs(dx) / FPS;
    const speed = Math.min(Math.max(speedX, 0), 1);

    let rotation = (MAX_ANGLE / 1) * speed;
    rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

    this.rotation += (rotation - this.rotation) * ROTATE_SPEED;

    const tmpPos = this.pos.clone().add(this.origin);
    ctx.save();
    ctx.translate(tmpPos.x, tmpPos.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.beginPath();
    ctx.fillStyle = '#f4e55a';
    ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT);
    ctx.restore();
  }

  down(point) {
    // ...

    // 눌렸을 때
    const xRatioValue = this.mousePos.x / WIDTH;
    this.origin.x = WIDTH * xRatioValue;
    this.origin.y = HEIGHT * this.mousePos.y / HEIGHT;

    this.sideValue = xRatioValue - 0.5;

    return this;
    } else {
      return null;
    }
  }

  move(point) {
    // ...
  }

  up() {
    // ...
  }
}
```
