<h1 align="center">WebGL</h1>

<p align="end">
  2021/08/06
</p>

`WebGL`은 `WebGL`을 지원하는 브라우저에서 플러그인을 사용하지 않고 `OpenGL ES 2.0` 
기반 API를 사용하여 `<canvas>`에서 3D 렌더링을 할 수 있게 해준다.
`WebGL` 프로그램은 JS로 작성된 제어 코드와 GPU에서 실행되는 `Shader code`로 구성된다.

### WebGL 시작하기

#### 3D 렌더링 준비

첫번째로 할 것은 렌더링을 할 `<canvas>`를 생성하는 것이다.

```html
<body>
  <canvas id="glCanvas" width="640" height="480"></canvas>
</body>
```

##### `WebGL context` 준비

렌더링을 위해 스크립트가 로드됐을 때 `WebGL context`를 설정한다.

```javascript
const canvas = document.querySelector("#glCanvas");
// WebGL context를 가져온다
const gl = canvas.getContext("webgl");

// 브라우저가 WebGL을 지원하지 않음
if (gl == null) {
    alert("Unable to load WebGL");
    return
}

// 검은색으로 초기화
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
```

---

#### WebGL 컨텍스트에 2D 물체 추가

컨텍스트를 성공적으로 불러온 이후에는, 렌더링을 시작할 수 있다.

##### 장면 그리기

중요한 것은 단순한 사각형을 그린다고 하더라도 그것은 3D 공간에 그려진다는 것 이다. 
단순히 평면 사각형을 렌더링하고 카메라 앞에 수직으로 세워놓는것과 다를것이 없다.  
따라서 장면에 그린 객체의 색을 생성할 쉐이더를 정의해야 한다.

+ 쉐이더 (Shaders)
  + `OpenGL ES Shading Language (GLSL)`을 이용해서 짜여진 프로그램
  + 모양을 구성하는 `vertex`들의 정보를 받아 픽셀을 렌더링하는데 필요한 데이터를 생성한다.
    + Vertex 쉐이더
      + `shape`가 렌더링 될 때 마다 `shape`의 각 `vertex`에 대해 Vertex 쉐이더가 실행
      + 입력된 `vertex`의 원래 좌표를 WebGL이 사용하는 `clip space` 좌표로 변환
    ####
    + Fragment 쉐이더
      + Vertex 쉐이더가 `vertex`를 처리한 뒤에 그려질 모든 픽셀에 대해 호출
      + 픽셀의 질감, 빛, 원래 색상을 이용해 표시될 색상을 알아낸다.

##### 쉐이더 초기화하기

1. `gl.createShader()`
   + 새로운 쉐이더를 생성한다.
2. `gl.shaderSource`
   + 쉐이더의 코드가 쉐이더로 보내진다.
3. `gl.compileShader`
   + 보내진 쉐이더 코드를 GPU에서 실행하기 위해 컴파일한다.
4. `gl.getShaderParameter()`
   + 컴파일이 성공했는지 확인하기 위해 `gl.COMPILE_STATUS`의 값을 `gl.getShaderParameter()`을 통해 확인한다.
   + `false`라면 컴파일에 실패한 것 이다.
5. 로드와 컴파일이 성공적으로 완료되었다면, 컴파일된 쉐이더가 반환된다.

##### 사각형 생성하기

```javascript
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 사각형 위치 설정
  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);
  return { position: positionBuffer };
}
```

##### 장면 렌더링하기

쉐이더가 처리된 후에, 사각형의 `vertex` 위치가 버퍼에 삽입되고, 실제로 장면을 렌더링 할 수 있다.

```javascript
function drawScene(gl, programInfo, buffers) {
    // 장면 초기화
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
    
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,
                   modelViewMatrix,
                   [-0.0, 0.0, -6.0]);
    {
      const numComponents = 2;
      const type = gl.FLOAT;s
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
  
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}
```

---

### WebGL에 색을 적용하기 위해 쉐이더를 사용

#### `vertex`들에 색 적용

```javascript
function initBuffers() {
    // R, G, B, A
    const colors = [
      1.0,  1.0,  1.0,  1.0, // 흰색
      1.0,  0.0,  0.0,  1.0, // 빨간색
      0.0,  1.0,  0.0,  1.0, // 초록색
      0.0,  0.0,  1.0,  1.0, // 파란색
    ];
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
      color: colorBuffer
    };
}
```

이 색상들이 사용되기 위해선 Vertex 쉐이더가 적절한 색을 버퍼에서 가져오기 위해 업데이트 되어야 한다.

#### Fragment에 색 적용하기

기존의 고정된 색을 적용하는 코드를 수정하여 `vColor`변수값을 받아 적용하도록 해야 한다.

```javascript
const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
`;
```

#### 색을 이용해 그리기

색상의 위치를 찾고 값을 설정하는 코드를 추가해야 한다.
```javascript
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
  },
  ...
}
```

그 다음, `drawScene()`에 실제로 설정한 색들을 사용하도록 설정해야 한다.

```javascript
  {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
  }
```

---

### WebGL로 물체 움직이기

#### 사각형 회전하게 만들기

사각형의 현재 각도를 저장할 변수가 필요하다.
```javascript
let squareRotation = 0.0;
```

그 다음 `drawScene()`함수를 현재 각도를 반영하도록 수정해야 한다.
```javascript
  mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        squareRotation,
        [0, 0, 1]);
```

실제로 애니메이션을 구현하기 위해선, 시간이 지남에 따라 사각형의 각도를 수정하는 코드가 필요하다.
```javascript
  let then = 0;

  // 반복적으로 장면을 렌더링함
  function render(now) {
      now *= 0.001;
      const deltaTime = now - then;
      then = now;
  
      drawScene(gl, programInfo, buffers, deltaTime);
  
      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
```

이제 `drawScene()` 마지막에 각도를 더하는 코드를 삽입해 사각형을 회전시킬 수 있다.
```javascript
squareRotation += deltaTime;
```

---

### WebGL로 3D 물체 생성하기

3차원으로 물체를 그리기 위해선 아까 만든 사각형에 6개의 면을 추가해야 한다.  
이를 효율적으로 하기 위해선, `gl.drawArrays()`를 직접 호출해서 그리는 방식으로 변경할것이다.

#### 큐브의 면의 위치를 정의하기

먼저, 큐브의 `vertex`위치 버퍼를 설정해야 한다.
```javascript
const positions = [
  // 앞면
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // 뒷면
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // 윗면
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // 밑면
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // 오른쪽 면
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // 왼쪽 면
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];
```

꼭짓점들에 `z-component`를 추가했으므로, `vertexPosition`의 `numComponents`를 3으로 설정해야 한다.
```javascript
const numComponents = 3;
gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 
        numComponents, 
        type,
        normalize,
        stride,
        offset
);
gl.enableVertexAttribArray(
    programInfo.attribLocations.vertexPosition
);
```

#### 요소 배열 정의

`vertex` 배열이 생성되었다면, 요소의 배열을 만들어야 한다.

```javascript
const indices = [
  0,  1,  2,      0,  2,  3,    // 앞
  4,  5,  6,      4,  6,  7,    // 뒤
  8,  9,  10,     8,  10, 11,   // 위
  12, 13, 14,     12, 14, 15,   // 아래
  16, 17, 18,     16, 18, 19,   // 오른쪽
  20, 21, 22,     20, 22, 23,   // 왼쪽
];

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
```

#### 큐브 그리기

`gl.bindBuffer()`와 `gl.drawElements`를 추가하여 큐브를 그린다.

```javascript
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

...

const vertexCount = 36;
const type = gl.UNSIGNED_SHORT;
const offset = 0;
gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
```

마지막으로, 큐브를 화전시킨다.

```javascript
mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * .7, [0, 1, 0]);
```

+ [예제](./assets/tutorial_3d_cube.html)

---

### 텍스처 사용하기

#### 텍스처 로딩

텍스처 파일을 로드해서 3D 물체에 적용할 수 있다.
+ `gl.createTexture()`
  + 새 텍스처 객체를 생성한다.

```javascript
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
```

#### 텍스처 면 매핑

텍스처의 로드는 완료됐지만, 사용하게 위해선 큐브의 면과 텍스처의 좌표를 매핑해야 한다.
```javascript
const textureCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

const textureCoordinates = [
    // 앞
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // 듀ㅣ
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // 위
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // 아래
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // 오른쪽
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // 왼족
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
```

#### 쉐이더 갱신

단색 대신 텍스처를 사용하기 위해선 쉐이더 코드 또한 업데이트 되어야 한다.

+ Vertex 쉐이더
  + Vertex 쉐이더가 색 대신 텍스처 좌표값을 받아올 수 있도록 대체
```javascript
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
`;
```
####
+ Fragment 쉐이더
  + Fragment 쉐이더는 색을 적용하는 대신 텍스처의 픽셀의 색을 기반으로 연산
```javascript
const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;
```

---

### 텍스처가 적용된 큐브 렌더링

색 버퍼를 특정하던 코드를 텍스처 코드로 대체한다.

```javascript
{
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
```

렌더링하기 전에, 각 면에 텍스처를 특정하는 코드를 추가한다.

```javascript
// WebGL에 수정할 텍스처를 0으로 설정
gl.activeTexture(gl.TEXTURE0);

// 텍스처 0에 로드한 텍스처를 연결
gl.bindTexture(gl.TEXTURE_2D, texture);

// 쉐이더에 텍스처를 텍스처 0 에 연결했다고 알림
gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
```

WebGL은 최소 8개의 텍스처 유닛을 지원하고, 이 중 첫번째가 `gl.TEXTURE0`이다.  
WebGL에 사용할 텍스처 유닛을 설정하고, `bindTexture()`를 이용해 해당 텍스처 유닛에
로드한 텍스처를 연결한다.

---

### WebGL의 라이팅

라이팅에는 크게 세 종류가 있다:
+ 환경광(Ambient light)
  + 장면을 투과하는 빛
  + 어떤 면을 향하든 장면의 모든 면에 동일하게 영향을 미침
####
+ 디렉셔널 라이트(Directional light)
  + 특정 방향으로만 발광하는 빛
  + 태양광과 같은 빛이다
####
+ 포인트 라이트(Point light)
  + 한 점에서 발광하며 모든 방향을 비춤
  + 현실에서 대부분의 광원이 작동하는 방식
  + 전구와 같은 빛

---

### 텍스처 애니메이션

영상 텍스처로서 사용하여 움직이는 텍스처를 적용할 수 있다.

#### 영상 로드
영상의 프레임을 가져올 `<video>`를 생성한다.
```javascript
var copyVideo = false;

function setupVideo(url) {
  const video = document.createElement('video');

  var playing = false;
  var timeupdate = false;

  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  // 영상에 데이터가 있다는걸 확인할 두개의 리스너를 설정한다

  video.addEventListener('playing', function() {
     playing = true;
     checkReady();
  }, true);

  video.addEventListener('timeupdate', function() {
     timeupdate = true;
     checkReady();
  }, true);

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}
```

#### 영상의 프레임을 텍스처로 사용

`initTexture()`를 수정해서 이미지 대신 영상의 프레임을 가져오도록 설정한다.
```javascript
const level = 0;
const internalFormat = gl.RGBA;
const width = 1;
const height = 1;
const border = 0;
const srcFormat = gl.RGBA;
const srcType = gl.UNSIGNED_BYTE;
const pixel = new Uint8Array([0, 0, 255, 255]);
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);
```

마지막으로, `render()`를 수정하여 `copyVideo`가 참일 때 렌더링 직전에 `updateTexture()`를 호출하도록 한다.
```javascript
const texture = initTexture(gl);
const video = setupVideo('video.mp4');
let then = 0;

function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;

    if (copyVideo) {
      updateTexture(gl, texture, video);
    }
    drawScene(gl, programInfo, buffers, texture, deltaTime);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
```