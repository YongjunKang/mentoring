# HTML5 Canvas Tutorial

## 사진 컬러 추출해서 물결 효과 만들기

##### Youtube : Interactive Developer [Link](https://youtu.be/kpF0n39xXVM)

---

본 클론코딩의 메인 이벤트는 자바스크립트로 컬러 추출해서 물결효과 만들기 입니다.

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
    <title>ColorWave</title>
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

    this.isLoaded = false; // 이미지 로드 여부 정의
    this.imgPos = {
      // 캔버스 내에 이미지 위치 속성 정의
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.image = new Image(); // img 객체 생성 및 동적으로 이미지 생성
    this.image.src = './assets/img/van_gogh.png'; // img 파일 경로
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage(); // 이미지가 준비되면 화면에 그려준다.
    };
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    if (this.isLoaded) {
      // 화면 사이즈 변경 시 이미지를 맞춰서 다시 그려줌
      this.drawImage();
    }
  }

  drawImage() {
    const stageRatio = this.stageWidth / this.stageHeight;
    const imgRatio = this.image.width / this.image.hegiht;

    this.imgPos.width = this.stageWidth;
    this.imgPos.height = this.stageHeight;

    // 이미지가 화면보다 클때 사이즈를 화면과 비교해서 수정해줌.
    if (imgRatio > stageRatio) {
      this.imgPost.width = Math.round(
        this.image.width * (this.stageHeight / this.image.height),
      ); // 입력값을 반올림한 수와 가장 가까운 정수 값을 반환.
      this.imgPos.x = Math.round((this.stageWidth - this.imgPos.width) / 2);
    } else {
      this.imgPos.height = Math.round(
        this.image.height * (this.stageWidth / this.image.width),
      );
      this.imgPos.y = Math.round((this.stageHeight - this.imgPos.height) / 2);
    }

    // Syntax(구문) (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

    /*
      image : 컨텍스트에 그릴 요소
      sx : 컨텍스트에 그릴 소스의 하위 사각형 왼쪽 위 모서리의 x축 좌표
      sy : 하위 사각형 왼쪽위 모서리의 y축 좌표
      sWidth : 그릴 소스의 하위 사각형 너비
      sHeight : 그릴 소스의 하위 직사각형 높이
      dx : 소스의 왼쪽 위 모서리를 배치할 대상 캔버스의 x축 좌표
      dy : 대상 캔버스의 y축 좌표
      dWidth : 캔버스에 그릴 너비
      dHeight : 캔버스에 그릴 높이
    */

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );
  }
}

window.onload = () => {
  new App();
};
```

---

### 잔물결 그리기 준비

```js
/* ripple.js */

export class Ripple {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.maxRadius = 0;
    this.speed = 10;
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  start(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = this.getMax(x, y);
  }

  animate(ctx) {}
}
```

---

### 간격을 계산할 함수 생성

```js
/* utils.js */

// 간격 함수
export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y); // 제곱근 계산 주어진 숫자에 루트(√ )를 씌운다. 만약 숫자가 음수이면 NaN를 반환합니다.
}
```

```js
/* ripple.js */

import { distance } from './utils.js';

export class Ripple {
  // ...

  start(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = this.getMax(x, y);
  }

  animate(ctx) {
    if (this.radius < this.maxRadius) {
      this.radius += this.speed;
    }

    ctx.beginPath();
    ctx.fillStyle = '#00ff00';
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fill();
  }

  getMax(x, y) {
    const c1 = distance(0, 0, x, y);
    const c2 = distance(this.stageWidth, 0, x, y);
    const c3 = distance(0, this.stageHeight, x, y);
    const c4 = distance(this.stageWidth, this.stageHeight, x, y);
    return Math.max(c1, c2, c3, c4); // 가장 큰 숫자를 반환
  }
}
```

### 잔물결 추가하기

###### 여기까지 진행하면 화면에 초록색 원 하나가 잔물결이 퍼지듯이 퍼져나가는 이벤트를 완성하게됩니다.

```js
/* app.js */

import { Ripple } from './ripple.js';

class App {
  constructor() {
    // ...

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.ripple = new Ripple(); // 리플 객체 생성

    // ...

    this.isLoaded = false;
    this.imgPos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    // ...

    // 애니메이션 생성
    window.requestAnimationFrame(this.animate.bind(this));

    // 클릭 이벤트 추가
    this.canvas.addEventListener('click', this.onClick.bind(this), false);
  }

  resize() {
    // ...

    // 리사이즈 추가
    this.ripple.resize(this.stageWidth, this.stageHeight);

    if (this.isLoaded) {
      this.drawImage();
    }
  }

  drawImage() {
    // ...
  }

  // animate 함수 추가
  animate() {
    this.ripple.animate(this.ctx);

    requestAnimationFrame(this.animate.bind(this));
  }

  // onClick 이벤트 함수 추가
  onClick(e) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );

    this.ripple.start(e.offsetX, e.offsetY);
  }
}

window.onload = () => {
  new App();
};
```

---

### Dot 추가하기

```js
/* dot.js */

const PI2 = Math.PI * 2;

export class Dot {
  constructor(x, y, radius, pixelSize, red, green, blue) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.pixelSize = pixelSize;
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  animate(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(
      this.x - this.pixelSizeHalf,
      this.y - this.pixelSizeHalf,
      this.pixelSize,
      this.pixelSize,
    ); // 캔버스에 사각형을 그린다 (x, y, width, height)

    ctx.beginPath();
    ctx.fillStyle = `rgb(${this.red},${this.green},${this.blue})`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }

  reset() {}
}
```

```js
/* app.js */

import { Ripple } from './ripple.js';
import { Dot } from './dot.js';

class App {
  constructor() {
    // ...

    // dot을 그려줄 새 캔버스 생성
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCtx = this.tmpCanvas.getContext('2d');

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.ripple = new Ripple();

    // ...

    // dot 속성 정의
    this.radius = 10;
    this.pixelSize = 30;
    this.dots = [];

    this.isLoaded = false;
    this.imgPos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    // ...

    window.requestAnimationFrame(this.animate.bind(this));

    this.canvas.addEventListener('click', this.onClick.bind(this), false);
  }

  resize() {
    // ...

    // Dot 캔버스 사이즈 정의
    this.tmpCanvas.width = this.stageWidth;
    this.tmpCanvas.height = this.stageHeight;

    this.ripple.resize(this.stageWidth, this.stageHeight);

    if (this.isLoaded) {
      this.drawImage();
    }
  }

  drawImage() {
    // ...

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );

    // Dot 캔버스에도 이미지를 그려준다.
    this.tmpCtx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );

    // 지정된 캔버스의 사각형에 대한 이미지 데이터를 포함 하는 개체를 반환 사각형의 왼쪽 위 모서리 (sx, sy)좌표는 , 아래 모서리 좌표는 (sx + sw, sy + sh)
    this.imgData.data = this.tmpCtx.getimgData.data(
      0,
      0,
      this.stageWidth,
      this.stageHeight,
    );

    this.drawDots(); // 추가
  }

  // dot 그리기 함수 추가
  drawDots() {
    this.dots = [];

    this.columns = Math.ceil(this.stageWidth / this.pixelSize);
    this.rows = Math.ceil(this.stageHeight / this.pixelSize);

    for (let i = 0; i < this.rows; i++) {
      const y = (i + 0.5) * this.pixelSize;
      const pixelY = Math.max(Math.min(y, this.stageHeight), 0);

      for (let j = 0; j < this.columns; j++) {
        const x = (j + 0.5) * this.pixelSize;
        const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

        // 각각 Dot의 인덱스 위치를 지정하면서 해당 픽셀 위치의 색 코드 값을 가져와 지정해줌
        const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
        const red = this.imgData.data[pixelIndex + 0];
        const green = this.imgData.data[pixelIndex + 1];
        const blue = this.imgData.data[pixelIndex + 2];

        // 최종적으로 화면에 순차적으로 Dot을 그려줌
        const dot = new Dot(
          x,
          y,
          this.radius,
          this.pixelSize,
          red,
          green,
          blue,
        );

        this.dots.push(dot);
      }
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ripple.animate(this.ctx);

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      if() {
        // 새로운 utils 함수 추가 후 진행
      }
    }
  }

  onClick(e) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );

    this.ripple.start(e.offsetX, e.offsetY);
  }
}

window.onload = () => {
  new App();
};
```

---

### 충돌 계산 함수 생성 및 Dot 애니메이션 적용

###### 여기까지 진행하면 클릭시 작은 Dot들이 사진의 색을 가지고 그 클릭 위치에서 부터 퍼져나감

```js
/* utils.js */

export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

// 충돌 계산 함수
export function collide(x1, y1, x2, y2, radius) {
  if (distance(x1, y1, x2, y2) <= radius) {
    return true;
  } else {
    return false;
  }
}
```

```js
/* app.js */

import { Ripple } from './ripple.js';
import { Dot } from './dot.js';
import { collide } from './utils.js';

class App {
  constructor() {
    // ...
  }

  resize() {
    // ...
  }

  drawImage() {
    // ...
  }

  drawDots() {
    //...
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ripple.animate(this.ctx);

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      if(collide(
        dot.x, dot.y, this.ripple.x, this.ripple.y, this.ripple.radius
      )) {
        dot.animate(this.ctx);
      }
    }
  }

  onClick(e) {
    // ...
}

window.onload = () => {
  new App();
};
```

---

### Bounce 추가

```js
/* dot.js */

const PI2 = Math.PI * 2;
const BOUNCE = 0.82; // 바운스 값 추가

export class Dot {
  constructor(x, y, radius, pixelSize, red, green, blue) {
    this.x = x;
    this.y = y;
    this.targetRadius = radius; // 타겟 반지름 값 추가
    this.radius = 0; // 반지름 기본 값 수정
    this.radiusV = 0; // 바운스
    this.pixelSize = pixelSize;
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  animate(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(
      this.x - this.pixelSizeHalf,
      this.y - this.pixelSizeHalf,
      this.pixelSize,
      this.pixelSize,
    );

    // 바운스 애니메이션 추가
    const accel = (this.targetRadius - this.radius) / 2;
    this.radiusV += accel;
    this.radiusV *= BOUNCE;
    this.radius += this.radiusV;

    ctx.beginPath();
    ctx.fillStyle = `rgb(${this.red},${this.green},${this.blue})`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }

  reset() {
    // Reset 추가
    this.radius = 0;
    this.radiusV = 0;
  }
}
```

```js
/* app.js */

import { Ripple } from './ripple.js';
import { Dot } from './dot.js';
import { collide } from './utils.js';

class App {
  constructor() {
    // ...
  }

  resize() {
    // ...
  }

  drawImage() {
    // ...
  }

  drawDots() {
    //...
  }

  animate() {
    // ...
  }

  onClick(e) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 바운스 애니메이션 추가
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].reset();
    }

    // ...
}

window.onload = () => {
  new App();
};
```

### 추가 디테일 작업

###### 위에 코드만으로 프로젝트는 마무리 됩니다.

###### 사진을 흑백 효과로 변경하기

```js
/* utils.js */

export function distance(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

export function collide(x1, y1, x2, y2, radius) {
  if (distance(x1, y1, x2, y2) <= radius) {
    return true;
  } else {
    return false;
  }
}

export function getBWValue(red, green, blue, isReversed) {
  const detect = 2;
  if (!isReversed) {
    return 255 - Math.floor((red + green + blue) / detect);
  } else {
    return Math.floor((red + green + blue) / detect);
  }
}
```

```js
/* app.js */

import { Ripple } from './ripple.js';
import { Dot } from './dot.js';
import { collide, getBWValue } from './utils.js';

class App {
  constructor() {
    // ...

    // dot 속성 변경
    this.radius = 16;
    this.pixelSize = 16;
    this.dots = [];

    // ...
  }

  resize() {
    // ...
  }

  drawImage() {
    const stageRatio = this.stageWidth / this.stageHeight;
    const imgRatio = this.image.width / this.image.hegiht;

    this.imgPos.width = this.stageWidth;
    this.imgPos.height = this.stageHeight;

    if (imgRatio > stageRatio) {
      this.imgPost.width = Math.round(
        this.image.width * (this.stageHeight / this.image.height);
      );
      this.imgPos.x = Math.round((this.stageWidth - this.imgPos.width) / 2);
    } else if {
      this.imgPos.height = Math.round(
        this.image.height * (this.stageWidth / this.image.width);
      );
      this.imgPos.y = Math.round((this.stageHeight - this.imgPos.height) / 2);
    }

    this.tmpCtx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height,
    );
  }

  drawDots() {
      // ...

      for (let j = 0; j < this.columns; j++) {
        const x = (j + 0.5) * this.pixelSize;
        const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

        const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
        const red = this.imgData.data[pixelIndex + 0];
        const green = this.imgData.data[pixelIndex + 1];
        const blue = this.imgData.data[pixelIndex + 2];

        // 추가
        const scale = getBWValue(red, green, blue, false);

        const dot = new Dot(
          x,
          y,
          this.radius,
          this.pixelSize,
          red,
          green,
          blue,
          scale,
        );

        if (dot.targetRadius > 0.1) {
          this.dots.push(dot);
        }
      }
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight); // 추가

    this.ripple.animate(this.ctx);

    // ...
  }

  onClick(e) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].reset();
    }

    this.ripple.start(e.offsetX, e.offsetY);
  }

window.onload = () => {
  new App();
};
```

```js
/* dot.js */

// ...

export class Dot {
  constructor(x, y, radius, pixelSize, red, green, blue, scale) {
    this.x = x;
    this.y = y;
    const ratio = radius / 256 / 2;
    this.targetRadius = ratio * scale;
    this.radius = 0;
    this.radiusV = 0;
    this.pixelSize = pixelSize;
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  animate(ctx) {
    const accel = (this.targetRadius - this.radius) / 2;
    this.radiusV += accel;
    this.radiusV *= BOUNCE;
    this.radisu += this.radiusV;

    ctx.beginPath();
    ctx.fillStyle = `#000`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  }

  reset() {
    // ...
  }
}
```

###### 추가로 css body background-color 를 #fff 로 변경
