<h1 align="center">Canvas 튜토리얼</h1>

<p align="end">
  2021/08/05
</p>

### 픽셀 다루기

#### ImageData 객체

`ImageData`는 캔버스의 영역에 대한 내재된 픽셀 데이터를 나타내며, 읽기 전용 값을 포함한다.

+ `width`
  + 이미지의 넓이를 픽셀로 환산한 값
+ `height`
  + 이미지의 높이를 픽셀로 환산한 값
+ `data`
  + `0 ~ 255` 사이의 정수값을 `RGBA`순서로 포함하고 있는 1차원 배열을 가지고 있는 `Uint8ClampedArray`

> `data`는 가공되지 않은 픽셀 데이터에 접근할 수 있는 `Uint8ClampedArray`를 반환한다.  
> 각 픽셀은 4개의 1바이트 데이터`(r, g, b, a)`로 이루어져 있다.

---

#### ImageData 객체 생성

`(width, height)` 크기의 `ImageData` 객체를 생성한다. 모든 생성된 픽셀은 `rgba(0, 0, 0, 0)` 값을 가진다.

```javascript
const imageData = ctx.createImageData(width, height);
```

#### 픽셀 데이터 가져오기

캔버스에서 특정 영역의 픽셀 데이터를 포함하는 `ImageData` 객체를 가져오기 위해선 `getImageData()`를 사용할 수 있다.

```javascript
const imageData = ctx.getImageData(left, top, width, height);
```
이 함수는 `(left, top)`과 `(left + width, top + height)`를 꼭짓점으로 가지는 사각형 내의 픽셀 데이터를
`ImageData`로 반환한다.

---

#### 픽셀 데이터 수정

`putImageData()`를 통해 `context`의 픽셀 데이터를 수정할 수 있다.
+ `putImageData(imageData, dx, dy)`
  + `dx`, `dy`
    + 수정할 픽셀 데이터의 왼쪽 상단 모서리의 좌표
  + `imageData`
    + 수정할 픽셀 데이터

---

#### 이미지 저장

`HTMLCanvasElement`는 이미지를 저장할 때 유용한 `toDataUrl()` 함수를 제공한다.  
`type` 파라미터에 따라 `data URI`를 반환한다.

> 만약 `canvas`가 `CORS`를 이용해 포함되어진 다른 `origin`에서 온 픽셀을 포함하고 있다면, `canvas`가 오염되어 내용물이
> 더 이상 읽거나 쓰는게 불가능해 질 것이다.

+ `canvas.toDataURL('image/png')`
  + PNG 이미지를 생성한다.
  ####
+ `canvas.toDataURL('image/jpeg', quality)`
  + JPG 이미지를 생성한다. 선택적으로 `0 ~ 1` 사이의 값을 `quality`로 설정할 수 있다.
  + `1`은 최고의 품질의 이미지를, `0`은 거의 알아볼 수 없지만 용량이 작은 이미지를 생성한다.

> 캔버스에서 생성된 `URI`는 `<image>`에 쓰이거나 저장소에 저장할 수 있다.

+ `canvas.toBlob(callback, type, encoderOptions)`
  + `canvas`안에 있는 이미지를 포함하는 `Blob` 객체를 생성한다.

---

### Hit 영역과 접근성

#### 대체 컨텐츠

`<canvas> ... </canvas>` 태그의 내용은 캔버스를 지원하지 않는 브라우저에서 사용시 대체 컨텐츠로 사용된다.  

```html
<canvas>
  <h2>Unsupported browser</h2>
  <p>
    This browser doesn't support canvas object.
    Please update your browser to the newest version and try again.
  </p>
</canvas>
```

---

#### ARIA 규칙

`ARIA(Accessible Rich Internet Application)`은 장애인 사용자가 웹사이트를 더 쉽게 사용할 수 있도록 하는 방법을 정의한다.
`ARIA` 속성을 사용하여 캔버스의 동작 및 용도를 설명할 수 있다.

```html
<canvas id="button" tabindex="0" role="button" aria-pressed="false" aria-label="Start game"></canvas>
```

---

#### 히트(Hit) 영역

마우스가 캔버스의 특정 영역 내에 있는지 확인할 수 있는 영역을 정의할 수 있다.  
실험적 API이며, 지원하지 않는 브라우저가 있을 수 있다.

+ `CanvasRenderingContext2D.addHitRegion()`
  + 히트 영역을 캔버스에 추가한다.
####
+ `CanvasRenderingContext2D.removeHitRegion()`
  + 캔버스에서 해당 `id`를 가진 히트 영역을 제거한다.
####
+ `CanvasRenderingContext2D.clearHitRegions()`
  + 캔버스에서 모든 히트 영역을 제거한다.
####
+ [예제](./assets/tutorial_hit.html)

---

#### 포커스 링(Focus rings)

키보드로 작업할 때 페이지 탐색에 도움이 되는 표시기를 생성한다.

+ `CanvasRenderingContext2D.drawFocusIfNeeded()`
  + 지정된 엘리먼트에 포커스가 되어있는 경우에 포커스 링을 그린다.
####
+ `CanvasRenderingContext2D.scrollPathIntoView()`
  + 현재 경로 또는 지정된 경로를 스크롤한다.

---

### 캔버스 최적화

`<canvas>`는 웹에서 2D 그래픽을 렌더링하는데 가장 널리 사용된다.  
하지만 웹사이트가 `Canvas API`를 한계치까지 사용하면 성능이 저하되기 시작한다.

#### 성능 팁

+ 캔버스에 표시되지 않는 반복 객체를 미리 그려라
  + 반복적인 작업이 있다면, 숨겨진 캔버스를 새로 만들고 그 캔버스에 미리 그려 넣을 수 있다.
  + 필요한 순간에 숨긴 캔버스에 그려진 이미지를 주 캔버스에 그려넣어 불필요한 렌더링을 줄인다.
  ####
+ 부동 소수점 좌표를 피하고 정수를 사용하라
  + 부동 소수점으로 객체를 렌더링할 때 부가적인 픽셀 렌더링이 발생한다.
  ```javascript
  ctx.drawImage(image, 0.3, 0.5);
  ```
  + 이렇게 되면 안티 엘리어싱 효과를 위해 추가 연산을 수행해야 한다.
  + `Math.floor()`를 사용하여 모든 좌표를 정수로 변환해야 한다.
  ####
+ `drawImage()`에서 크기를 조정하지 마라
  + `drawImage()`에서 크기를 조정하지 말고 다양한 이미지 크기를 미리 생성해라.
  ####
+ 복잡한 장면에 여러 개의 레이어 캔버스를 사용하라
  + 웹사이트에서 일부 객체는 자주 이동하나 다른 객체는 상대적으로 고정된 위치에 남아있을 수 있다.
  + 이런 상황에서 `<canvas>`를 여러 개 겹쳐서 생성하여 부하를 줄일 수 있다.
  ####
+ 큰 배경 이미지는 CSS를 사용하라
  + 정적인 배경 이미지가 있는 경우 CSS의 `background` 속성을 사용하여 캔버스 아래에 배치할 수 있다.
  + 매 틱마다 배경을 렌더링 할 필요가 없어진다.
  ####
+ `CSS 변환`을 사용하여 캔버스의 크기를 조정하라
  + `CSS 변환`은 GPU를 사용하기 때문에 더 빠르다.
  ####
+ 투명도를 사용하지 마라
  + 웹사이트가 캔버스를 사용하지만 투명 배경을 사용하지 않는 경우
  `HTMLCanvasElement.getContext()`로 컨텍스트를 생성할 때 `alpha` 옵션을 `false`로 설정한다.
  
---

#### 추가 팁
+ 배치 캔버스와 함께 호출한다
+ 불필요한 캔버스 상태 변경을 피한다
+ 화면의 차이만 렌더링하고 완전히 새로운 상태로 렌더링하지 마라
+ `shadowBlur` 속성을 사용하지 마라
+ 텍스트 렌더링을 피하라
+ 캔버스를 지우는 여려가지 방법을 시도해보라
  + `clearRect()`
  + `fillRect()`
  + 캔버스 크기 조정
+ 애니메이션에선 `setInterval()` 대신 `requestAnimationFrame()`을 사용하라
+ 무거운 물리 연산 라이브러리를 주의하라