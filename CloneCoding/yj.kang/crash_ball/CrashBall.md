# HTML5 Canvas Tutorial

## 화면에 튕기는 공 만들기

##### Youtube : Interactive Developer [Link](https://www.youtube.com/watch?v=sLCiI6d5vTM)

---

본 클론코딩의 메인 이벤트는 충돌입니다.

윈도우에만 충돌하는 이벤트가 아닌 가운데 블록을 하나 둬서 윈도우와 블로 두가지 모두 충돌하는 프로젝트입니다.

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
    <title>CrashBall</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <script type="module" src="app.js"></script>
  </body>
</html>
```

##### 간단한 meta 태그 설명

- `meta charset="UTF-8"` : 문서의 문자 인코딩 방식을 지정한다.
- `http-equiv="X-UA-Compatible"` : 구 버전 브라우저를 지원하기 위해 사용
  - `content="IE=edge,chrome=1"` : IE 모든 브라우저의 호환성 보기 모드를 무시하고 Chromeframe을 사용하는 유저에게 렌더링한다.
- `name="viewport"` : 모바일 브라우저의 뷰포트 크기 조절을 지정.
  - `width=device-width` : 가로는 디바이스 크기
  - `initial-scale=1` : 보여지는 화면의 zoom up 정도를 1배율
  - `maximum-scale=1` : 최대 zoom up 정도를 1배율
  - `user-scalable=0` : 유저의 zoom up 을 제어한다.

---

#### CSS

```css
/* style.css */

* {
  user-select: none;
  -ms-user-select: none;
  outline: 0;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #161e38;
}

canvas {
  width: 100%;
  height: 100%;
}
```

---

[1. 메인 캔버스 정의](#메인-캔버스-정의)
[2. 공을 생성한다.](#공을-생성한다)
[3. 공을 그려준다.](#공을-그려준다)
[4. 벽돌을 생성한다.](#벽돌을-생성한다)
[5. 벽돌을 그려준다.](#벽돌을-그려준다)
[6. 벽돌과 공 충돌](#벽돌과-공-충돌)

#### Javascript

#### 메인 캔버스 정의

```js
/* app.js */

class App {
  constructor() {
    // 생성된 객체를 생성하고 초기화하기 위한 메서드
    this.canvas = document.createElement('canvas'); // canvas를 스크립트로 만든다.
    this.ctx = this.canvas.getContext('2d'); // 해당 canvas에서 컨텍스트를 불러온다.

    document.body.appendChild(this.canvas); // 생성된 캔버스를 body에 추가한다.

    window.addEventListener('resize', this.resize.bind(this), false); // 크기가 변경될때 마다 새로운 resize 함수를 생성한다.
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    // 스크린 사이즈를 가져와 애니메이션의 크기를 정의한다.
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    // 레티나 디스플레이에서 선명하게 보이게 하려고 두배로 설정
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  animate(t) {
    // 애니메이션을 실제로 구동시키는 함수
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

// 웹 브라우저 내의 모든 요소가 준비가 되면 실행
window.onload = () => {
  new App(); // 생성자 함수 객체를 만들어준다.
};
```

- 함수 선언과 클래스 선언의 중요한 차이점은 함수 선언의 경우 호이스팅이 일어나지만, 클래스 선언은 그렇지 않기 때문에 클래스를 사용하기 위해서는 클래스를 먼저 선언해야 한다.
- 클래스를 선언하기 전에 사용하면 `ReferenceError` 를 던진다.

> - ###### 호이스팅(hoisting) : 함수 안에 있는 선언들을 모두 끌어올려서 해당 함수 유효 범위의 최상단에 선언하는 것
>   - 자바스크립트 Parser가 함수 실행 전 해당 함수를 한 번 훑는다.
>   - 함수 안에 존재하는 변수/함수선언에 대한 정보를 기억하고 있다가 실행시킨다.
>   - 유효 범위 : 함수 블록 `{}` 안에서 유효
>   - 실제로 코드가 끌어 올려지는 건 아니며 메모리에서는 변화가 없다.

---

#### 공을 생성한다

```js
/* ball.js */

export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    // 스테이지 사이즈, 반지름, 속도를 받아온다.

    this.radius = radius;
    this.vx = speed; // x 좌표값을 움직이는 속도
    this.vy = speed; // y 좌표값을 움직이는 속도

    const diameter = this.radius * 2;
    // 스테이지에 랜덤으로 위치할 수 있게 초기화
    this.x = this.radius + Math.random() * (stageWidth - diameter);
    this.y = this.radius + Math.random() * (stageHeight - diameter);
  }

  draw(ctx, stageWidth, stageHeight) {
    // canvas context에 그림을 그리는 함수
    this.x += this.vx; // x좌표로 공이 움직인다.
    this.y += this.vy; // y좌표로 공이 움직인다.

    this.bounceWindow(stageWidth, stageHeight); // 충돌 감지 이벤트

    ctx.fillStyle = '#fdd700'; // 색을 정의
    ctx.beginPath(); // 새로운 그리기 경로를 생성
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // 호를 이용해 원을 생성
    ctx.fill(); // 경로의 내부를 채워서 도형을 생성
  }

  bounceWindow(stageWidth, stageHeight) {
    // 스테이지 넓이와 높이를 받아온다.
    const minX = this.radius; // 실제 공의 끝 부분은 반지름 값
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    // x, y 좌표 중 공이 닿았는지 판별
    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1; // 닿았다면 반대로 튕긴다.
      this.x += this.vx;
    } else if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1; // 닿았다면 반대로 튕긴다.
      this.y += this.vy;
    }
  }
}
```

---

#### 공을 그려준다

```js
/* app.js */

// 공을 불러온다.
import { Ball } from './ball.js';

class App {
  constructor() {
    // ...

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    // 공을 생성한다.
    this.ball = new Ball(this.stageWidth, this.stageHeight, 60, 10);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  // ...

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    // 이전 애니메이션을 지워준다.
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 공 애니메이션
    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight);
  }
}

// ...
```

---

#### 벽돌을 생성한다

```js
/* block.js */

export class Block {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.maxX = width + x;
    this.maxY = height + y;
  }

  draw(ctx) {
    // 공을 추적하기 위한 최대 값
    const xGap = 80;
    const yGap = 60;

    ctx.fillStyle = '#ff384e';
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();

    // 디자인을 위해 그림자를 생성한다.
    ctx.fillStyle = '#190f3a';
    ctx.beginPath();
    ctx.moveTo(this.maxX, this.maxY);
    ctx.lineTo(this.maxX - xGap, this.maxY + yGap); // 좌표를 따라 이동
    ctx.lineTo(this.x - xGap, this.maxY + yGap);
    ctx.lineTo(this.x, this.maxY);
    ctx.fill();

    // 옆 그림자
    ctx.fillStyle = '#9d0919';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.maxY);
    ctx.lineTo(this.x - xGap, this.maxY + yGap);
    ctx.lineTo(this.x - xGap, this.maxY + yGap - this.height);
    ctx.fill();
  }
}
```

---

#### 벽돌을 그려준다.

```js
/* app.js */

import { Ball } from './ball.js';
// 벽돌을 불러온다.
import { Block } from './block.js';

class App {
  constructor() {
    // ...

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    this.ball = new Ball(this.stageWidth, this.stageHeight, 60, 10);
    // 벽돌을 생성한다.
    this.block = new Block(700, 30, 300, 450);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  // ...

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    // 이전 애니메이션을 지워준다.
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 벽돌 애니메이션
    this.block.draw(this.ctx);
    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight);
  }
}

// ...
```

---

#### 벽돌과 공 충돌

```js
/* app.js */

import { Ball } from './ball.js';
import { Block } from './block.js';

class App {
  //...

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.block.draw(this.ctx);

    // 공에 block을 넘겨준다.
    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.block);
  }
}
```

```js
/* ball.js */

export class Ball {
  // ...

  draw(ctx, stageWidth, stageHeight, block) {
    this.x += this.vx;
    this.y += this.vy;

    this.bounceWindow(stageWidth, stageHeight);
    this.bounceBlock(block);

    // ...
  }

  // ...

  bounceBlock(block) {
    // 블럭과 공이 닿았는지 확인
    const minX = block.x - this.radius;
    const maxX = block.maxX + this.radius;
    const minY = block.y - this.radius;
    const maxY = block.maxY + this.radius;

    // 공이 블럭에 충돌할때 양옆 혹은 위앞에 충돌하는지 확인하기 위해서 근접한 값을 판단
    if (this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      const x1 = Math.abs(minX - this.x);
      const x2 = Math.abs(this.x - maxX);
      const y1 = Math.abs(minY - this.y);
      const y2 = Math.abs(this.y - maxY);
      const min1 = Math.min(x1, x2);
      const min2 = Math.min(y1, y2);
      const min = Math.min(min1, min2);

      if (min == min1) {
        this.vx *= -1;
        this.x += this.vx;
      } else if (min == min2) {
        this.vy *= -1;
        this.y += this.vy;
      }
    }
  }
}
```
