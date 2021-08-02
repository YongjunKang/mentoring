## WebGL, Canvas

---

### Canvas

- Canvas API는 Javascript HTML `<canvas></canvas>` 엘리먼트를 통해 그래픽을 그리기 위한 수단을 제공합니다.

- 애니메이션, 게임 그래픽, 데이터 시각화, 사진 조작 및 실시간 비디오 처리를 위해 사용됩니다.

- 주로 2D 그래픽에 중점을 두고 있다.

### 기본 예시

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvas 예시</title>
  </head>
  <body>
    <canvas id="canvas"></canvas>
  </body>
</html>
```

```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);
```

`<canvas></canvas>` 엘리먼트에 대한 참조를 얻은 다음,
`HTMLCanvasElement.getContext()` 메소드에서 엘리먼트의 컨텍스트(렌더링될 그리기의 대상)을 얻습니다.

실제 그리기는 `CanvasRenderingContext2D` 인터페이스를 사용해 수행됩니다.

`fillStyle` 프로퍼티는 사각형을 초록색으로 만듭니다.

`fillRect` 메소드는 좌측 상단 코너를 (10, 10) 위치에 놓으며, 너비를 150, 높이를 100으로 지정합니다.

###### 메소드

- 클래스 내부에 정의된 함수 (객체의 함수)

###### 프로퍼티

- 어떤 값, 이 값이 다른 값과 연관을 가지고 있을 때 프로퍼티라고 한다.
- 예시로 length라는 프로퍼티는 문자열 안에 있는 문자의 양을 정수로 나타낸 값을 담고 있다.

---

### Canvas 튜토리얼

```html
<canvas id="tutorial" width="150" height="150"></canvas>
```

`<canvas></canvas>` 는 src및 alt 속성이 없다는 점만 제외하면 `<img/>` 요소처럼 보입니다.

실제로 해당 요소에는 `width`와 `height`의 두 속성만 있습니다.

이것들은 모두 선택사항이며 `DOM 프로퍼티`를 사용하여 설정할 수도 있습니다.

아무 속성도 지정하지 않으면 처음 300픽셀, 150픽셀의 너비와 높이를 가지게 됩니다.

CSS로 크기를 지정하면 초기 캔버스의 비율을 고려하지 않으면 왜곡되어 나타납니다.

---

### 대체 컨텐츠

`video` `audio` `img` 와 달리 하위 버전의 브라우저 혹은 텍스트 기반의 브라우저 등과 같이 캔버스를 지원하지 않는 브라우저들을 위한 대체 컨텐츠를 정의하여야 합니다.

대체 컨텐츠를 제공할 시, 지원하지 않는 브라우저에서 컨테이너를 무시하고 컨테이너 내부의 대체 컨텐츠를 렌더링 합니다.

예시로 캔버스 내용에 대한 텍스트 설명을 제공하거나 동적으로 렌더링 된 내용의 정적 이미지를 제공 할 수 있습니다.

```html
<canvas id="stockGraph" width="150" height="150">
  current stock price: $3.15 +0.15
</canvas>

<canvas id="clock" width="150" height="150">
  <img src="images/clock.png" width="150" height="150" alt="" />
</canvas>
```

#### 닫는 태그가 필수

대체 컨텐츠가 제공되는 방식때문에, 캔버스 요소는 닫는 태그가 필요합니다. 닫는 태그가 없다면 문서의 나머지 부분이 대체 컨텐츠로 간주되고 보이지 않을 것입니다.

---

### 렌더링 컨텍스트

- 고정 크기의 드로잉 영역을 생성하고 하나 이상의 **렌더링 컨텍스(rendering contexts)** 를 노출하여, 출력할 컨텐츠를 생성하고 다루게 됩니다.

캔버스는 처음에 투명상태로 비어있습니다.
무언가를 표시하기 위해서, 어떤 스크립트가 랜더링 컨텍스트에 접근하여 그리도록 할 필요가 있습니다.

`getContext()` 메소드를 이용해서, 렌더링 컨텍스트와 그리기 함수들을 사용할 수 있습니다.

컨텍스트 타입을 지정하는 하나의 파라미터를 가집니다.

###### 매개변수란 변수의 특별한 한 종류로서, 함수 등과 같은 서브루틴의 인풋으로 제공되는 여러 데이터 중 하나를 가리키기 위해 사용 여기서 서브루틴의 인풋으로 제공되는 여러 데이터들을 전달인자라고 한다.

### 지원여부 검사

```js
const canvas = document.getElementById('tutorial');

if (canvas.getContext) {
  const ctx = canvas.getContext('2d');
  // 그리기 코드
} else {
  // 미지원 내용 작성
}
```

### 권장하는 최소 템플릿

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Canvas tutorial</title>
    <script type="text/javascript">
      function draw() {
        const canvas = document.getElementById('tutorial');
        if (canvas.getContext) {
          const ctx = canvas.getContext('2d');
        }
      }
    </script>
    <style type="text/css">
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>
  <body onload="draw();">
    <canvas id="tutorial" width="150" height="150"></canvas>
  </body>
</html>
```

### 두 개의 직사각형 그리기

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script type="application/javascript">
      function draw() {
        const canvas = document.getElementById('canvas');
        if (canvas.getContext) {
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = 'rgb(200,0,0)';
          ctx.fillRect(10, 10, 50, 50);

          ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
          ctx.fillRect(30, 30, 50, 50);
        }
      }
    </script>
  </head>
  <body onload="draw();">
    <canvas id="canvas" width="150" height="150"></canvas>
  </body>
</html>
```

---

## 캔버스(canvas)를 이용한 도형 그리기

### 그리드

캔버스 그리드 혹은 좌표공간(**coordinate space**),
HTML 골격(skeleton)은 가로 세로 각각 150 픽셀의 캔버스 요소를 가지고 잇습니다.

기본적으로 그리드의 1단위는 캔버스의 1픽셀과 같습니다.

그리드의 원점은 좌측상단의 (0,0) 입니다.

모든 요소들은 이 원점을 기준으로 위치됩니다.

사각형을 그리드 중앙에 그리면 사각형이 (0,0)과 마주보는 위치를 기준으로 x,y 좌표 만큼 떨어지게 되고 해당 좌표는 사각형의 좌표가 됩니다.

`SVG`와 다르게 `Canvas`는 오직 직사각형 하나의 원시적인 도형만을 제공합니다.

다른 모든 도형들은 무조건 하나 혹은 하나 이상의 path 와 여러 점으로 이어진 선으로 만들어집니다.

`path drawing` 함수(function)들을 통해 아주 어려운 도형들도 그릴 수 있습니다.

캔버스 위에 직사각형을 그리는데에는 세가지 함수(function)가 있습니다.

- `fillRect(x, y, width, height)` : 색칠된 직사각형을 그립니다.

- `strokeRect(x, y, width, height)` : 직사각형 윤곽선을 그립니다.

- `clearRect(x, y, width, height)` : 특정 부분을 지우는 직사각형이며, 지워진 부분은 완전히 투명해집니다.

세 함수는 모두 같은 변수를 가집니다.

`x`와 `y`는 캔버스의 좌측상단에서 사각형의 (원점으로부터 상대적인) 위치를 뜻하며, `width` 와 `height` 는 사각형의 크기를 뜻하게 됩니다.

---

### 직사각형 도형 예제

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}
```

- `fillRect()` 함수는 가로 세로 100 픽셀 사이즈의 검정 사각형을 그립니다.
- 이후 `clearRect()` 함수가 60x60 픽셀의 사각형 크기로 도형 중앙을 지우게 되고,
- `strokeRect()`은 이 빈 사각형 공간 안에 50x50 픽셀 사이즈의 윤곽선만 있는 사각형을 만들게 됩니다.

---

### 경로 그리기

- 경로는 직사각형 이외의 유일한 원시적인(primitive) 도형입니다.
- 경로는 점들의 집합이며, 선의 한 부분으로 연결되어 여러가지 도형, 곡선을 이루고 두께와 색을 나타내게 됩니다.

- 경로나 하위 경로(sub-path)는 닫힐 수 있습니다.

- 경로를 이용하여 도형을 만들 때에는 추가적인 단계를 거쳐야 합니다.

1. 경로를 생성한다.
2. 그리기 명령어를 사용하여 경로상에 그린다.
3. 경로가 한번 만들어졌다면, 경로를 렌더링 하기 위해서 윤곽선을 그리거나 도형 내부를 채운다.

#### 경로를 그리기 위한 함수

- `beginPath()` : 새로운 경로를 만듭니다. 경로가 생성됬다면, 이후 그리기 명령들은 경로를 구성하고 만드는데 사용하게 됩니다.

- Path 메소드 : 물체를 구성할 때 필요한 여러 경로를 설정하는데 사용하는 함수

- `closePath()` : 현재 하위 경로의 시작 부분과 연결된 직선을 추가합니다.

- `stroke()` : 윤곽선을 이용하여 도형을 그립니다.

- `fill()` : 경로 내부를 채워서 내부가 채워진 도형을 그립니다.

경로는 도형을 이루는 하위경로(선, 아치 등)들의 집합으로 이루어져있습니다.

`beginPath()` 메소드가 호출될 때 마다, 하위 경로의 모음은 초기화되며, 새로운 도형을 그릴 수 있게됩니다.

###### 열린 path가 비어있는 경우 (`beginPath()` 메소드를 사용한 직 후, 혹은 캔버스를 새로 생성한 직후), 첫 경로 생성 명령은 실제 동작에 상관없이 `moveTo()`로 여겨지게 됩니다. 경로를 초기화한 직후에는 항상 명확하게 시작 위치를 설정해두는 것이 좋습니다.

###### `fill()` 메소드 호출 시, 열린 도형은 자동으로 닫히게 되므로 `closePath()`메소드를 호출하지 않아도 됩니다. 이것은 `stroke()` 메소드에는 적용되지 않습니다.

### 삼각형 그리기

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
}
```

---

### 펜(pen) 이동하기

실제로는 어떤 것도 그리지 않지만 경로의 일부가 되는 `moveTo()` 함수가 있습니다. 펜이나 연필을 종이위에서 들어 옆으로 옮기는 것이라고 보시면 됩니다.

`moveTo(x, y)` : 펜을 x와 y로 지정된 좌표로 옮긴다.

### 스마일 아이콘 그리기

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
    ctx.stroke();
  }
}
```

---

### 선

직선을 그리기 위해서는 `lineTo()` 메소드를 사용할 수 있습니다.

`lineTo(x, y)` : 현재의 드로잉 위치에서 x와 y로 지정된 위치까지 선을 그립니다.

시작점은 이전에 그려진 경로에 의해 결정 되며, 이전 경로의 끝점이 다음 그려지는 경로의 시작점이 됩니다. 시작점은 `moveTo()` 메소드를 통해 변경될 수 있습니다.

### 두 삼각형 그리기

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    // Filled triangle
    ctx.beginPath();
    ctx.moveTo(25, 25);
    ctx.lineTo(105, 25);
    ctx.lineTo(25, 105);
    ctx.fill();

    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(125, 125);
    ctx.lineTo(125, 45);
    ctx.lineTo(45, 125);
    ctx.closePath();
    ctx.stroke();
  }
}
```

---

### 호(arc)

호나 원을 그리기 위해서는 `arc()` 혹은 `arcTo()` 메소드를 사용합니다.

`arc(x, y, radius, startAngle, endAngel, anticlockwise)`

- (x, y) 위치에 원점을 두면서, 반지름 r을 가지고, startAngle에서 시작하여 endAngle에서 끝나며 주어진 anticlockwise 방향으로 향하는 호를 그리게 됩니다. (기본값은 시계방향 회전)

`arcTo(x1, y1, x2, y2, radius)`

- 주어진 제어점들과 반지름으로 호를 그리고, 이전 점과 직선으로 연결합니다.

###### anticlockwise 변수는 true일 때 호를 반시계 방향으로 그리게 되며, 그렇지 않을 경우에는 시계 방향으로 그리게 됩니다.

- `arc` 함수에서 각도는 각이 아닌 라디안 값을 사용합니다. `radians = (Math.PI/180)*degrees`

### 12가지 다양한 각도의 호 그리기

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    for (const i = 0; i < 4; i++) {
      for (const j = 0; j < 3; j++) {
        ctx.beginPath();
        const x = 25 + j * 50; // x coordinate
        const y = 25 + i * 50; // y coordinate
        const radius = 20; // Arc radius
        const startAngle = 0; // Starting point on circle
        const endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
        const anticlockwise = i % 2 == 0 ? false : true; // clockwise or anticlockwise

        ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

        if (i > 1) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  }
}

// for loops문을 통해 호들의 행과 열을 읽는다.
// beginPath()를 사용해 각 호의 새로운 경로를 만든다.
```

---

### 베지어(Bezier) 곡선과 이차(Quadratic) 곡선

베지어 곡선은 경로 타입이며, 삼차(cubic)와 이차(quadric) 변수가 모두 가능합니다.

복잡한 유기체적 형태 (organic shape)를 그리는데 사용됩니다.

`quadraticCurveTo(cp1x, cp1y, x, y)`

- 지정된 제어점을 사용하여 현재 펜의 위치에서 지정된 끝점까지 이차 베지어 곡선을 그립니다.

`bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`

- 삼차 베지어 곡선을 그립니다.

이차 베지에 곡선은 시작점과 끝점 그리고 하나의 제어점을 가지고 있지만

삼차 베지에 곡선은 두개의 제어점을 사용하고 있습니다.

### 이차 베지에 곡선 예제

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    // Quadratric curves example
    ctx.beginPath();
    ctx.moveTo(75, 25);
    ctx.quadraticCurveTo(25, 25, 25, 62.5);
    ctx.quadraticCurveTo(25, 100, 50, 100);
    ctx.quadraticCurveTo(50, 120, 30, 125);
    ctx.quadraticCurveTo(60, 120, 65, 100);
    ctx.quadraticCurveTo(125, 100, 125, 62.5);
    ctx.quadraticCurveTo(125, 25, 75, 25);
    ctx.stroke();
  }
}
```

### 삼차 베지에 곡선 예제

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    // Cubic curves example
    ctx.beginPath();
    ctx.moveTo(75, 40);
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    ctx.fill();
  }
}
```

### 직사각형

위에서 언급한 직사각형 메소드 세 가지 외에 `rect()` 메소드도 있습니다.

현재 열린 패스에 직사각형 경로를 추가합니다.

`rect(x, y, width, height)`

- 좌측상단이 (x,y) 이고, 폭과 높이가 지정된 직사각형을 그립니다.

이 메소드가 실행되기 전에, (x, y) 매개변수를 가진 `moveTo()` 메소드가 자동으로 호출됩니다.

현재의 펜위치가 자동으로 기본좌표로 초기화됩니다.

### 모든 경로 함수를 합쳐 여러 게임 캐릭터 그려보기

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    roundedRect(ctx, 12, 12, 150, 150, 15);
    roundedRect(ctx, 19, 19, 150, 150, 9);
    roundedRect(ctx, 53, 53, 49, 33, 10);
    roundedRect(ctx, 53, 119, 49, 16, 6);
    roundedRect(ctx, 135, 53, 49, 33, 10);
    roundedRect(ctx, 135, 119, 25, 49, 10);

    ctx.beginPath();
    ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
    ctx.lineTo(31, 37);
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 35, 4, 4);
    }

    for (i = 0; i < 6; i++) {
      ctx.fillRect(115, 51 + i * 16, 4, 4);
    }

    for (i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 99, 4, 4);
    }

    ctx.beginPath();
    ctx.moveTo(83, 116);
    ctx.lineTo(83, 102);
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    ctx.lineTo(111, 116);
    ctx.lineTo(106.333, 111.333);
    ctx.lineTo(101.666, 116);
    ctx.lineTo(97, 111.333);
    ctx.lineTo(92.333, 116);
    ctx.lineTo(87.666, 111.333);
    ctx.lineTo(83, 116);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(91, 96);
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
    ctx.moveTo(103, 96);
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

// A utility function to draw a rectangle with rounded corners.

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}
```

위 코드에서 `fillStyle` 코드와 사용된 유틸리티 함수(`roundedRect()`) 를 사용하여 코드의 양과 복잡함을 줄여주는데 도움이 됐다는 점만 알아두면 좋습니다.

---

### Path2D 오브젝트 (Path2D Objects)

- 캔버스에 객체를 그리는 일련의 경로와 그리기 명령이 있을 수 있습니다.

- 코드를 단순화하고 성능을 향상시키기 위해 최근 버전의 브라우저에서 `Path2D` 객체를 사용할 수 있습니다.

- 이러한 드로잉 명령은 캐시하거나 기록할 수 있습니다.

`Path2D()`

- 생성자는 새로운 `Path2D` 객체를 반환합니다. 선택적으로 다른 경로를 인수 받거나(복사본 생성), SVG 경로 데이터로 구성된 문자열을 받아서 객체로 반환합니다.

```js
new Path2D(); // empty path object
new Path2D(path); // copy from another Path2D object
new Path2D(d); // path from SVG path data
```

`moveTo`, `rect`, `arc`, `quadraticCurveTo` 등과 같은 모든 경로 메소드 들은 `Path2D` 객체에서 사용 가능합니다.

`Path2D` API는 또한 `addPath` 메소드를 사용하여 경로를 결합하는 방법을 추가합니다.

`Path2D.addPath(path [, transform]`

- 옵션으로 변환 행렬(transformation matrix)을 사용하여 현재 경로에 경로를 추가합니다.

### 직사각형과 원을 만들어보기

- 두 도형 모두 Path2D object로 저장 한다.
- 여러 메소드들은 지금 사용하는 path가 아닌 Path2D object를 옵션으로 선택하여 사용한다.

```js
function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    const rectangle = new Path2D();
    rectangle.rect(10, 10, 50, 50);

    const circle = new Path2D();
    circle.moveTo(125, 35);
    circle.arc(100, 35, 25, 0, 2 * Math.PI);

    ctx.stroke(rectangle);
    ctx.fill(circle);
  }
}
```

###### SVG paths 도 사용할 수 있다.

###### 확장 가능한 벡터 그래픽(Scalable Vector Graphics), SVG는 그래픽을 마크업하기 위한 W3C XML의 특수언어(dialect)입니다. SVG는 파이어폭스, 오페라, 웹킷 브라우저, 인터넷 익스플로러 및 기타 여러 브라우저에서 부분적으로 지원하고 있습니다.

---

다음 시간

## 스타일과 색 적용하기 부터 이어서 시작

### WebGL
