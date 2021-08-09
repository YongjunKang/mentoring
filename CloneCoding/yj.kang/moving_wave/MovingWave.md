# HTML5 Canvas Tutorial

## 움직이는 웨이브 만들기

##### Youtube : Interactive Developer [Link](https://www.youtube.com/watch?v=D6EiRSRhsbQ)

---

본 클론코딩의 메인 이벤트는 움직이는 웨이브입니다.

3개의 웨이브가 있고, 각각 다른색을 줘서 움직임이 풍부하고 깊이감 있는 디자인을 줍니다.

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
    <title>MovingWave</title>
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

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
```

#### 포인트를 지정

'웨이브'를 그린다기 보다 간격을 가진 좌표를 하나씩 만들어서 좌표의 y 값을 아래위로 이동시키고, 각각의 좌표를 하나의 선으로 연결시킨다고 생각하자.

```js
/* point.js */
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.1; // 움직이는 속도
    this.cur = 0;
    this.max = Math.random() * 100 + 150; // 얼만큼 움직일 것인가?
  }

  update() {
    this.cur += this.speed; // 현재값을 속도만큼 증가
    this.y = this.fixedY + Math.sin(this.cur) * this.max; // 사인 함수를 이용해 아래위로 움직일 수 있게 한다.
  }
}
```

아래위를 움직이는 y 좌표들을 만든 후 직선이 아닌 곡선으로 연결해준다.

- 점을 위아래로 움직이는건 sin 함수를 사용한다.
  - sin 함수에 일정 값을 추가하거나 빼면 리턴값이 1까지 증가했다가 -1 까지 감소한다.

#### 웨이브를 그린다

```js
/* wave.js */
import { Point } from './point.js';

export class Wave {
  constructor() {}

  resize(stageWidth, stageHeight) {
    // 애니메이션의 좌표값을 가져온다.
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    // 화면 중앙
    this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;

    this.init();
  }

  init() {
    this.point = new Point(this.centerX, this.centerY);
  }

  draw(ctx) {
    // 웨이브의 움직임을 확인하기 위해 포인터 하나만 생성해서 중앙에 빨간점을 그려준다.
    ctx.beginPath();
    ctx.fillStyle = '#ff0000';

    this.point.update();

    ctx.arc(this.point.x, this.point.y, 30, 0, 2 * Math.PI);
    ctx.fill();
  }
}
```

```js
/* app.js */
import { Wave } from './wave.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // 웨이브를 생성
    this.wave = new Wave();

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    // 웨이브 리사이즈
    this.wave.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 웨이브 애니메이션
    this.wave.draw(this.ctx);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
```

#### 웨이브 여러개 만들기

```js
/* wavegroup.js*/
import { Wave } from './wave.js';

export class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 6;

    this.color = [
      'rgba(0, 199, 235, 0.4)',
      'rgba(0, 146, 199, 0.4)',
      'rgba(0, 87, 158, 0.4)',
    ];

    this.waves = [];

    // totalWaves 수 만큼 웨이브 생성
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = new Wave();
    }
  }

  // 위에서 totalWaves 만큼 함수를 실행된다.
  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}
```

```js
/* point.js */
export class Point {
  // 포인트에 index 값을 넘겨줘 현재 포인트가 몇번째 포인트인지를 확인
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.1;
    this.cur = index;
    this.max = Math.random() * 100 + 150;
  }

  // ...
}
```

```js
/* wave.js */
import { Point } from './point.js';

export class Wave() {
  // 고유 인덱스를 통해 웨이브가 차이를 두고 움직일 수 있다.
  constructor(index, totalPoints, color) {
    this.index = index;
    this.totalPoints = totalPoints;
    this.color = color;
    this.points = [];
  }

  resize(stageWidth, stageHeight) {
    // ...

    // 포인트 넓이는 총 스테이지 넓이 나누기 전체 포인트
    // 포인트 간격
    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    this.init();
  }

  init() {
    this.points = [];

    // 간격만큼 포인트를 화면에 그려준다.
    for (let i = 0; i< this.totalPoints; i++) {
      const point = new Point(
        this.index + i,
        this.pointGap * i,
        this.centerY,
      );
      this.points[i] = point;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color; // 현재 컬러값

    // 처음과 끝 포인트를 제외한 가운데 포인트만 움직임
    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    ctx.moveTo(prevX, prevY)

    // 포인트의 인덱스가 0이거나 마지막 인덱스이면 업데이트 함수를 실행하지 않는다.
    for (let i = 1; i <this.totalPoints; i++) {
      if( i< this.totalPoints - 1) {
        this.points[i].update();
      }

      // 곡선으로 변경할때도 사용하기 위해서 이전과 현재 포인트의 중간값으로 지정해준다.
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      // ctx.lineTo(cx,cy);
      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    // 직선으로 포인트 연결하기
    ctx.lineTo(prevX, prevY);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();
    ctx.closePath();
  }
}
```

```js
/* app.js */
import { WaveGroup } from './wavegroup.js';

class App {
  constructor() {
    // ...

    // 웨이브를 웨이브 그룹으로 변경
    this.wavegroup = new WaveGroup();

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    // ...

    // 웨이브 그룹 리사이즈
    this.wavegroup.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // 웨이브 그룹 애니메이션
    this.wavegroup.draw(this.ctx);

    requestAnimationFrame(this.animate.bind(this));
  }
}

// ...
```

```js
/* wavegroup.js*/
import { Wave } from './wave.js';

export class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 6;

    this.color = [
      'rgba(0, 199, 235, 0.4)',
      'rgba(0, 146, 199, 0.4)',
      'rgba(0, 87, 158, 0.4)',
    ];

    this.waves = [];

    for (let i = 0; i < this.totalWaves; i++) {
      // 우선 하나의 웨이브 생성
      const wave = new Wave(i, this.totalPoints, this.color[i]);
      this.waves[i] = wave;
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}
```

---

#### 추가 정리

###### bind 함수?

- callback 함수로 어떤 객체의 메서드를 전달하게 되면, 더 이상 그 객체의 정보는 남아있지 않음.
- 객체의 메서드에 접근해서, 객체의 정보까지 가져오는게 아닌, 메서드만 복사해서 가져옴.
- 예를 들어, requestAnimationFrame(this.animate); 로 App의 animate 메서드를 넘기면 animate 메서드 코드 내부에서는
  this 를 App 객체가 아닌 window 같은 전역 객체로 인식하게 됨.
- 이거를 막기 위한 것이 바인딩(binding).
- 원하는 객체를 callback 함수에 넘겨줄 수 있음.
- requestAnimationFrame(this.animate.bind(this)); 처럼 App 객체를 animate 메서드에 넘겨줌.
