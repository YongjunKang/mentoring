# HTML5 Canvas Tutorial

## 움직이는 그라데이션 만들기

##### Youtube : Interactive Developer [Link](https://www.youtube.com/watch?v=LLfhY4eVwDY)

---

본 클론코딩의 메인 이벤트는 움직이는 그라데이션입니다.

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
    <title>MovingGradient</title>
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
  background-color: #ffffff;
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

// 컬러 정의
const COLORS = [
  { r: 45, g: 74, b: 227 }, // blue
  { r: 250, g: 255, b: 89 }, // yellow
  { r: 255, g: 104, b: 248 }, // pupple
  { r: 44, g: 209, b: 252 }, // skyblue
  { r: 54, g: 233, b: 84 }, // green
];

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // 디바이스의 물리적인 픽셀과 CSS 픽셀의 비율을 반환
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    // 화면에 그려질 파티클 설정
    this.totalParticles = 1;
    this.particles = [];
    this.maxRadius = 90;
    this.minRadius = 40;

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

    this.createParticles();
  }

  createParticles() {
    let curColor = 0;
    this.particles = [];

    for (let i = 0; i < this.totalParticles; i++) {}
  }

  animate() {}
}

window.onload = () => {
  new App();
};
```

#### 파티클 생성

```js
/* glowparticle.js */
const PI2 = Math.PI * 2;

export class GlowParticle {
  constructor(x, y, radius, rgb) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rgb = rgb;

    this.vx = Math.random() * 4;
    this.vy = Math.random() * 4;

    // 크기를 랜덤으로 생성한다.
    this.sinValue = Math.random();
  }

  animate(ctx, stageWidth, stageHeight) {
    // 크기를 증가한다.
    this.sinValue += 0.01;
    this.radius += Math.sin(this.sinValue);

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.vx += -1;
      this.x += 10;
    } else if (this.x > stageWidth) {
      this.vx += -1;
      this.x -= 10;
    }

    if (this.y < 0) {
      this.vy += -1;
      this.y += 10;
    } else if (this.y > stageHeight) {
      this.vy += -1;
      this.y -= 10;
    }

    ctx.beginPath();

    ctx.fillStyle = `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},1)`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }
}
```

```js
/* app.js */

import { GlowParticle } from './glowparticle.js';

// ...

class App {
  // ...

  createParticles() {
    let curColor = 0;
    this.particles = [];

    //
    for (let i = 0; i < this.totalParticles; i++) {
      const item = new GlowParticle(
        Math.random() * this.stageWidth,
        Math.random() * this.stageHeight,
        Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
        COLORS[curColor],
      );

      if (++curColor >= COLORS.length) {
        curColor = 0;
      }

      this.particles[i] = item;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 파티클 애니메이션
    for (let i = 0; i < this.totalParticles; i++) {
      const item = this.particles[i];
      item.animate(this.ctx, this.stageWidth, this.stageHeight);
    }
  }
}

// ...
```

### 그라데이션 효과 적용

```js
/* glowparticle.js */

// ...

  animate(ctx, stageWidth, stageHeight) {
    //...

    ctx.beginPath();
    // 그라데이션으로 채운다.
    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.01,
      this.x,
      this.y,
      this.radius,
    );
    g.addColorStop(0, `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},1)`);
    g.addColorStop(1, `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},0)`);
    ctx.fillStyle = g;

    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }
}
```

### 파티클 개수 및 반지름 변경

```js
/* app.js */

// ...

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.totalParticles = 15; // 파티클 수
    this.particles = [];
    this.maxRadius = 900; // 파티클 반지름
    this.minRadius = 400; // 파티클 반지름

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

   resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.globalCompositeOperation = 'saturation'; // 화면의 도형을 합성한다.

    this.createParticles();
  }

// ...

```
