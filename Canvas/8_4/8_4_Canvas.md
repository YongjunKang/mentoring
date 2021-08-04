<h1 align="center">Canvas 튜토리얼</h1>

<p align="end">
  2021/08/04
</p>

### 변형

#### 상태 저장과 복원

+ `save()`
  + `canvas`의 모든 상태를 저장한다.
####
+ `restore()`
  + 가장 최근에 저장된 `canvas`의 상태를 복원한다.

> Canvas 상태는 스택에 쌓이며, `save()`가 호출될 떄 마다 현재 상태가 스택에 푸시된다.  
> `save()`는 원하는 만큼 호출될 수 있고, `restore()`를 사용할 때 마다 마지막으로 저장된
상태가 복원된다.

+ [예제](./assets/tutorial_save_restore.html)

---

#### 이동

그리드에서 `canvas`룰 원점에서 다른 점으로 이동하는데 사용한다.

+ `translate(x, y)`
  + 그리드에서 `canvas`와 원점을 이동한다.
  + `x`는 이동시킬 수평 거리를, `y`는 그리드에서 수직으로 떨어지는 거리를 표시한다.
  
> 변형하기 전, `canvas`의 상태를 저장하는 것이 좋다.

+ [예제](./assets/tutorial_translate.html)

---

#### 회전
`canvas`를 현재 원점을 기준으로 회전하는데 사용한다.

+ `rotate(angle)`
  + `canvas`를 현재 원점을 기준으로 라디안의 `angle`만큼 시계방향으로 회정한다.

> 회전의 중심점은 항상 `canvas`원점이다.
> 중심점을 바꾸려면 `translate()`로 `canvas`를 이동해야 한다.

+ [예제](./assets/tutorial_rotate.html)

---

#### 확대, 축소

`canvas`에서 단위를 키우거나 줄이는데 사용한다.  
벡터 모양이나 비트맵 요소를 축소하거나 확대하는데 사용될 수 있다.

+ `scale(x, y)`
  + `canvas` 단위를 수평으로 `x`만큼, 수직으로 `y`만큼 확대/축소한다.
  + `1.0`보다 작은 값이면 축소, `1.0`보다 큰 값이면 확대한다. `1.0`이면 그대로 유지한다.

> 음수를 이용하여 축을 대칭시킬 수 있다.
> ```javascript
> translate(0, canvas.height);  // 캔버스 맨 밑으로 이동
> scale(1, -1);                 // y축 대칭
> ```

+ [예제](./assets/tutorial_scale.html)

---

#### 변형

변환 행렬(transformation matrix)로 변경할 사항을 즉시 적용할 수 있다.

+ `transform(a, b, c, d, e, f)`
  + 매개 변수에 표시된 행렬을 이용해 현재 변환 행렬을 곱한다.
  + 변환 행렬은 `\left[ \begin{array}{ccc} a & c & e \\ b & d & f \\ 0 & 0 & 1 \end{array} \right]`
    와 같이 작성된다.
    + `a` : scale-x, 수평으로 확대/축소
    + `b` : skew-x, 수평으로 비스듬히 기울이기
    + `c` : skew-y, 수직으로 비스틈히 기울이기
    + `d` : scale-y, 수직으로 확대/축소
    + `e` : translate-x, 수평으로 이동
    + `f` : translate-y, 수직으로 이동

+ `setTransform(a, b, c, d, e, f)`
  + 현재 변형 상태를 단위 행렬로 재설정 후 `transform()`을 적용한다.
+ [예제](./assets/tutorial_transform.html)

---

### 도형 합성

도형을 합성하기 위한 순서를 `globalCompositeOperation`을 이용하여 변경할 수 있다.

+ 'globalCompositeOperation = type'
  + 새로운 도형을 그릴 때 합성 방법을 설정한다.
  + `type`
    + `source-over`
      + 기본 설정으로, 새로운 도형이 원래 도형 위에 그려진다.
    + `source-in`
      + 새로운 도형이 원래 도형과 겹치는 부분만 그려지며, 나머지는 투명하게 설정된다.
    + `source-out`
      + 새로운 도형이 원래 도형과 겹치지 않는 부분에만 그려진다.
    + `source-atop`
      + 새로운 도형이 원래 도형과 겹치는 부분에만 그려진다.
    + `destination-over`
      + 새로운 도형이 원래 도형 아래에 그려진다.
    + `destination-in`
      + 원래 도형 중 새로운 도형과 겹치는 부분이 유지되며, 나머지는 투명하게 설정된다.
    + `destination-out`
      + 원래 도형 중 새로운 도형과 겹치지 않는 부분이 유지된다.
    + `destination-atop`
      + 원래 도형 중 새로운 도형과 겹치는 부분만 유지되며, 새로운 도형은 원래 도형 아래에 그려진다.
    + `lighter`
      + 두 도형이 겹치는 곳의 색상이 두 색상값을 합한 값으로 결정된다.
    + `copy`
      + 새로운 도형만 그려진다.
    + `xor`
      + 두 도형이 겹치는 곳이 투명하게 변하며, 나머지는 평범하게 그려진다.
    + `multiply`
      + 위쪽 레이어의 픽셀값이 아래쪽 레이어의 해당하는 픽셀값과 곱해지며, 결과적으로 어두운 이미지가 생성된다.
    + `screen`
      + 픽셀값을 뒤집고 곱한 다음 다시 뒤집는다. (`multiply`의 반대)
    + `overlay`
      + `multiply`와 `screen`의 조합이며, 아래쪽 레이어의 어두운 부분은 더 어두워지고 밝은 부분은 더 밝아진다.
    + `darken`
      + 두 레이어 중 어두운 픽셀값을 쓴다.
    + `lighten`
      + 두 레이어 중 밝은 픽셀값을 쓴다.
    + `color-dodge`
      + 아래쪽 레이어의 픽셀값을 위쪽 레이어의 반전된 픽셀값으로 나눈다.
    + `color-burn`
      + 아래쪽 레이어의 반전된 픽셀값을 위쪽 레이어의 픽셀값으로 나누고, 그 값을 다시 반전한다.
    + `hard-light`
      + `overlay`와 같이 `multiply`와 `screen`의 조합이지만, 위아래 레이어의 순서가 반대이다.
    + `soft-light`
      + 조금 더 부드러운 `hard-light`이다.
    + `difference`
      + 한쪽 레이어의 픽셀값에서 다른 쪽 레이어의 픽셀값을 뺀다.
    + `exclusion`
      + `difference`와 비슷하지만 대비가 덜하다.
    + `hue`
      + 아래쪽 레이어의 채도와 명도를 보존하고 위쪽 레이어의 색상을 적용한다.
    + `saturation`
      + 아래쪽 레이어의 색상과 명도를 보존하고 위쪽 레이어의 채도를 적용한다.
    + `color`
      + 아래쪽 레이어의 명도를 보존하고 위쪽 레이어의 색상과 채도를 적용한다.
    + `luminosity`
      + 아래쪽 레이어의 색상과 채도를 보존하고 위쪽 레이어의 명도를 적용한다.

---

#### 잘라내기 경로

잘라낸 경로 밖에 있는 모든 것은 캔버스에 그려지지 않는다.  
`globalCompositeOperation`의 `source-in`이나 `source-atop`과 비슷한 효과이다.  
잘라내기 경로는 `globalCompositeOperation`과는 달리 캔버스에 그려지지 않는다.

+ `clip`
  + 현재 그려지는 경로를 잘라내기 경로로 만든다.
  > `<canvas>` 요소의 초기 설정값으로써 캔버스는 자신과 같은 크기의 잘라내기 경로를 가진다.  
  > 크기가 같기 때문에 나타나지는 않는다.

---

### 애니메이션

#### 기본 애니메이션

+ 단계
  1. 캔버스를 비운다.
     + 그리려는 도형이 Canvas를 가득 채우는 것이 아니라면, 이전에 그려진 모든 도형을 지워야 한다.
     + `clearRect()`를 사용하여 지울 수 있다.
     ####
  2. 캔버스 상태를 저장한다.
     + 캔버스 상태에 영향을 주는 설정값을 바꾸고, 바뀐 값을 장면마다 사용하려 한다면
       원래 상태를 저장해야 한다.
     ####
  3. 애니메이션할 도형을 그린다.
     + 실제 장면을 그리는 단계
     ####
  4. 캔버스 상태를 복원한다.
     + 새로운 장면을 그리기 전에 저장된 상태를 복원한다.
  
---

#### 애니메이션 제어

정해진 시간마다 그리기 함수를 실행하는 방법이다.

+ `setInterval(function, delay)`
  + `delay(ms)` 마다 `function` 함수를 반복 실행한다.

+ `setTimeout(function, delay)`
  + `delay(ms)` 이후 `function`을 한번 실행한다.

#### 사용자 상호작용

키보드나 마우스 입력을 받아 사용자와 상호 작용하는 애니메이션 함수를 만든다.

> ```javascript
> const mAnim = new MiniDaemon(null, animateShape, 500, Infinity);
> ```
> 또는 
> ```javascript
> const mAnim = new Daemon(null, animateShape, 500, Infinity);
> ```

---

### 애니메이션 고급

#### 공 그리기

먼저 Canvas를 생성한다.
```html
<canvas id="canvas" width="600" height="300"></canvas>
```

`context`를 가져오고 `ball` 오브젝트를 생성한다.

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ball = {
  x: 100,
  y: 100,
  radius: 25,
  color: 'blue',
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

ball.draw();
```

#### 속도 추가하기

공에 속도 벡터를 추가하여 움직일 수 있게 하고, 이전 프레임의 오래된 원은 `clear()`로 캔버스에서 지운다.

```javascript
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;

var ball = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 2,
  radius: 25,
  color: 'blue',
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('mouseover', function(e) {
  raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener('mouseout', function(e) {
  window.cancelAnimationFrame(raf);
});

ball.draw();
```

#### 경계 설정하기

공이 화면을 빠져나가지 않게 하기 위한 경계를 설정한다.  
공의 `x`와 `y` 위치가 캔버스를 빠져나갔는지 체크해서 방향과 속도를 바꿔주며,  
`draw()`에 확인 코드를 추가한다.

```javascript
if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
  ball.vy = -ball.vy;
}
if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
  ball.vx = -ball.vx;
}
```

#### 감속

움직임을 리얼하게 만들기 위해 세로 속도를 프레임마다 줄이며, 공이 바닥에서 튀게 만든다.

```javascript
ball.vy *= .99;
ball.vy += .25;
```

#### 후행 효과

`clearRect`를 이용해서 이전 프레임을 지우던 것을 `fillRect`로 투명도를 설정해 후행 효과를 만든다.

```javascript
ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

#### 마우스 컨트롤 추가

`mousemove` 이벤트를 사용하여 공이 마우스를 따라오게 만들고. `click` 이벤트를 사용하여
공을 놓으면 다시 공이 튀도록 한다.

```javascript
canvas.addEventListener('mousemove', function(e) {
  if (!running) {
    clear();
    ball.x = e.clientX;
    ball.y = e.clientY;
    ball.draw();
  }
});

canvas.addEventListener('click', function(e) {
  if (!running) {
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

canvas.addEventListener('mouseout', function(e) {
  window.cancelAnimationFrame(raf);
  running = false;
});
```