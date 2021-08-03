## Canvas 튜토리얼

---

### 스타일과 색 적용

+ 색상 적용
  + `fillStyle`과 `strokeStyle` 두가지 속성을 사용할 수 있다.
  + `fillStyle`은 도형 내부의 색을, `strokeStyle`은 도형의 윤곽선 색을 설정한다.
  ```javascript
  // 도형에 '빨간색'을 적용한다
  ctx.fillStyle = 'red';
  ctx.fillStyle = 'rgba(255, 0, 0)';
  ctx.fillStyle = '#FF0000';
  
  // 윤곽선에 '빨간색'을 적용한다
  ctx.strokeStyle = 'red';
  ctx.strokeStyle = 'rgba(255, 0, 0)';
  ctx.strokeStyle = '#FF0000';
  ```
  ###### 색의 올바른 값은 CSS3 사양에 나오는 `<color>` 값이다.
  + [fillStyle 예제](./assets/tutorial_fillStyle.html)
  + [strokeStyle 예제](./assets/tutorial_fillStyle.html)

  
+ 투명도
  + `globalAlpha` 값을 설정하거나 위의 `fillStyle`이나 `strokeStyle`에 반투명 색을 적용한다.
  ```javascript
  // 투명도를 50%로 설정한다
  ctx.globalAlpha = 0.5
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ```
  
---

### 선 모양

+ 선의 모양을 바꿀 수 있는 방법이다.
  + `lineWidth = value`
    + 이후 그려질 선의 두께를 설정한다.
  ####
  + `lineCap = type`
    + 선의 끝 모양을 설정한다.
  ####
  + `lineJoin = type`
    + 선들이 만나는 '모서리' 의 모양을 결정한다.
  ####
  + `miterLimit = value`
    + 두 선이 예각으로 만날 때 접합점의 두께를 제어할 수 있도록 연결부위의 크기를 
      제한하는 값을 설정한다.
  ####
  + `getLineDash()`
    + 음수가 아닌 짝수를 포함하는 현재 선의 대시 패턴 배열을 반환한다.
  ####
  + `setLineDash(segments)`
    + 현재 선의 대시 패턴을 설정한다.
  ####
  + `lineDashOffset = value`
    + 선의 대시 배열의 시작점을 지정한다.
  ####

---

### 그라디언트

+ 선형 및 원형의 그라디언트를 생성할 수 있다.
  + `createLinearGradient(x1, y1, x2, y2)`
    + 시작점 `(x1, y1)`, 종료점 `(x2, y2)`를 
      가지는 선형 그라디언트를 생성한다.
  ####
  + `createRadialGradient(x1, y1, r1, x2, y2, r2)`
    + 반지름이 `r1`인 `(x1, y1)`이 중심인 원과 반지름이 `r2`인 `(x2, y2)`가 중심인
      원을 사용하여 원형 그라디언트를 생성한다.
  ```javascript
  const linearGradient = ctx.createLinearGradient(0, 0, 150, 150);
  const radialGradient = ctx.createRadialGradient(75, 75, 0, 75, 75, 100);
  ```
  
  + `addColorStop(pos, color)`
    + 그라디언트 객체에 새로운 색 중단점을 생성한다.
    + ###### pos는 0.0 ~ 1.0 사이의 숫자이고 색상의 상대적 위치를 정의한다.
  ```javascript
  const lineargradient = ctx.createLinearGradient(0, 0, 150, 150);
  lineargradient.addColorStop(0, '#FFFFFF');
  lineargradient.addColorStop(1, '#000000');
  ``` 
  + [linearGradient 예제](./assets/tutorial_linearGradient.html)
  + [radialGradient 예제](./assets/tutorial_radialGradient.html)

---

### 패턴

+ `createPattern(image, type)` : 새 캔버스 패턴 객체를 만들어 반환한다.
  ###### image는 CanvasImageSource(HTMLImageElement, 캔버스, video 등), type는 이미지 사용 방법을 나타내는 문자열이다.
  + `type`의 종류
    + `repeat`
      + 수직 및 수평 방향으로 이어 붙인다.
      ####
    + `repeat-x`
      + 수평 방향으로만 이어 붙인다.
      ####
    + `repeat-y`
      + 수직 방향으로만 이어 붙인다.
      ####
    + `no-repeat`
      + 이미지를 한번만 사용한다.
  ```javascript
  const img = new Image();
  img.src = 'image.png';
  const ptrn = ctx.createPattern(img, 'repeat');
  ```
  
---

### 그림자

+ `shadowOffsetX = float`
  + 그림자가 객체에서 연장되는 수평 거리를 나타낸다.
####
+ `shadowOffsetY = float`
  + 그림자가 객체에서 연장되는 수직 거리를 나타낸다.
####
+ `shadowBlur = float`
  + blur 효과의 크기를 나타낸다. 픽셀 수와 일치하지 않는다.
####
+ `shadowColor = color`
  + 그림자 효과의 색상을 나타낸다.
####
+ [예제](./assets/tutorial_shadow.html)

---

### 캔버스 채우기 규칙

+ `fill`을 사용할 때 한 점이 경로 안쪽이나 바깥쪽에 있는지, 따라서 채워지는지 여부를 결정하기 위한 규칙을 제공할 수 있다. 경로가 교차하거나 중첩된 경우에 유용하다.
  + `nonzero` : [non-zero winding rule](https://en.wikipedia.org/wiki/Nonzero-rule)
  ####
  + `evenodd` : [even-odd winding rule](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule)
  ####
  + [예제](./assets/tutorial_fill.html)

---

### 텍스트 그리기
+ `fillText(text, x, y, [, maxWidth])`
  + (x, y) 위치에 주어진 텍스트를 채운다. 최대 폭(width) 값은 선택적이다.
####
+ `strokeText(text, x, y, [, maxWidth])`
  + (x, y) 위치에 주어진 텍스트를 칠한다. 최대 폭(width) 값은 선택적이다.

---

### 텍스트 스타일 적용

+ `font = value`
  + 텍스트를 그릴 때 사용되는 현재 폰트. 기본값으로 sans-serif의 10px가 설정되어 있다.
####
+ `textAlign = value`
  + 텍스트 정렬을 설정한다. `start, end, left, rignt, center`가 있다.
####
+ `textBaseline = value`
  + 베이스라인 정렬을 설정한다. `top, hanging, middle, alphabetic, ideographic, bottom`이 있다.
####
+ `direction = value`
  + 글자 방향을 설정한다. `ltr, rtl, inherit`이 있다.

---

### 이미지 사용하기
`PNG, JPEG, GIF`등 브라우저에서 지원하는 포맷은 모두 사용 가능하다.  
같은 페이지 소스에서 다른 `Canvas`로 만들어진 이미지 또한 사용 가능하다.  

이미지를 불러오는 것은 기본적으로 두 단계가 필요하다:  
1. `HTMLImageElement` 를 참조하거나 다른 캔버스 요소를 소스로 사용한다.
2. `drawImage()` 함수를 사용하여 캔버스에 그림을 그린다.

---

### 이미지 불러오기
`canvas API`는 아래의 데이터 타입을 소스로 사용할 수 있다:
+ `HTMLImageElement`
  + `Image()`를 통해 만들어진 이미지
####
+ `SVGImageElement`
  + `<image>`로 불러온 이미지
####
+ `HTMLVideoElement`
  + HTML `<video>` 요소를 이미지 소스로 사용하여 비디오의 현재 프레임을 가져온다.
####
+ `HTMLCanvasElement`
  + 다른 `<canvas>` 요소를 이미지 소스로 사용

#### 같은 페이지의 이미지 사용

+ `document.images`
  + 페이지의 모든 이미지의 모음을 가져온다.
+ `document.getElementsByTagName(tag)`
  + 페이지의 모든 `tag`의 모음을 가져온다.
+ `document.getElementById(id)`
  + 페이지의 `id` 객체를 가져온다.

#### 이미지 객체 생성하기

새로운 `HTMLImageElement`를 스크립트 내에서 생성하여 사용한다.
```javascript
const img = new Image();
img.src = 'image.png';
```

이미지 로딩이 끝나기 전에 `drawImage()`를 호출하면 아무것도 일어나지 않는다.  
이미지 로딩이 끝난 뒤에 호출해야 한다.
```javascript
const img = new Image();
img.onLoad = () => {
    // 이미지 그리는 함수 호출
}
img.src = 'image.png';
```

#### 데이터를 사용하여 불러오기

`data:url`을 사용해 이미지를 불러올 수 있다.
`Data URL`은 Base64로 인코딩된 이미지를 바로 사용할 수 있게 한다.
```javascript
const img = new Image();
img.src = 'data:image/gif;base64,<인코딩된 문자열>';
```

#### 비디오 프레임 사용

`<video>` 객체에서 재생되는 동영상의 프레임을 사용할 수 있다.
```javascript
const canvas = document.getElementById('canvas');
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    return document.getElementById('video');
}
```

### 이미지 그리기

이미지를 소스로부터 불러온 뒤엔 `drawImage()`를 이용하여 `canvas`에 그릴 수 있다.
+ `drawImage(image, x, y)`
  + `image`를 `(x, y)`에 그린다.
  + [예제](./assets/tutorial_drawImage.html)

#### 크기 조정

+ `drawImage(image, x, y, w, h)`
  + 이미지의 크기를 `(w, h)`로 조정하여 그린다.

#### 이미지 자르기

+ `drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)`
  + 이미지를 `(sx, sy)`부터 `(sw, sh)`만큼 자른 다음
캔버스에 `(dx, dy)`를 시작점으로 `(dw, dh)` 크기로 그린다.
