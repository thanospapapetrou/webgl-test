class WebGLTest {
  static AMBIENT_LIGHT_COLOR = [0.3, 0.3, 0.3];
  static DIRECTIONAL_LIGHT_COLOR = [1, 1, 1];
  static DIRECTIONAL_LIGHT_DIRECTION = [0.85, 0.8, 0.75];
  static FAR = 100;
  static FIELD_OF_VIEW = Math.PI / 4; // rad
  static NEAR = 0.1;
  static ROTATION_SPEED = Math.PI; // rad/s

  static #COLORS = [
    // Front face: white
    1.0,  1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,  1.0,
    // Back face: red
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    // Top face: green
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    // Bottom face: blue
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    // Right face: yellow
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    // Left face: purple
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0
  ];
  static #FRAGMENT_SHADER = `
    varying highp vec3 fragmentLight;
    varying lowp vec4 fragmentColor;

    void main(void) {
      gl_FragColor = vec4(fragmentColor.rgb * fragmentLight, fragmentColor.a);
    }
  `;
  static #INDICES = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  static #NORMALS = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];
  static #POSITIONS = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  static #ATTRIBUTE_COLOR = 'color';
  static #ATTRIBUTE_NORMAL = 'normal';
  static #ATTRIBUTE_POSITION = 'position';
  static #CANVAS_SELECTOR = '#gl';
  static #UNIFORM_AMBIENT_LIGHT_COLOR = 'ambientLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'directionalLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'directionalLightDirection';
  static #UNIFORM_MODEL_VIEW_MATRIX = 'modelViewMatrix';
  static #UNIFORM_NORMAL_MATRIX = 'normalMatrix';
  static #UNIFORM_PROJECTION_MATRIX = 'projectionMatrix';
  static #VERTEX_SHADER = `
    uniform mat4 modelViewMatrix;
    uniform mat4 normalMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 ambientLightColor;
    uniform vec3 directionalLightColor;
    uniform vec3 directionalLightDirection;

    attribute vec4 position;
    attribute vec3 normal;
    attribute vec4 color;

    varying highp vec3 fragmentLight;
    varying lowp vec4 fragmentColor;

    void main(void) {
      gl_Position = projectionMatrix * modelViewMatrix * position;
      fragmentLight = ambientLightColor + (directionalLightColor * max(dot((normalMatrix * vec4(normal, 1.0)).xyz, normalize(directionalLightColor)), 0.0));
      fragmentColor = color;
    }
  `;
  static #WEB_GL_CONTEXT = 'webgl';

  #gl;
  #program;
  #projectionMatrix;
  #positions;
  #normals;
  #colors;
  #indices;
  #time;
  #rotation;

  static main() {
    const test = new WebGLTest(document.querySelector(WebGLTest.#CANVAS_SELECTOR).getContext(WebGLTest.#WEB_GL_CONTEXT));
    requestAnimationFrame(time => test.render(time));
  }

  constructor(gl) {
    this.#gl = gl;
    this.#program = new Program(gl,
      new VertexShader(gl, WebGLTest.#VERTEX_SHADER),
      new FragmentShader(gl, WebGLTest.#FRAGMENT_SHADER),
      [
        WebGLTest.#UNIFORM_MODEL_VIEW_MATRIX,
        WebGLTest.#UNIFORM_NORMAL_MATRIX,
        WebGLTest.#UNIFORM_PROJECTION_MATRIX,
        WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
      ],
      [
        WebGLTest.#ATTRIBUTE_POSITION,
        WebGLTest.#ATTRIBUTE_NORMAL,
        WebGLTest.#ATTRIBUTE_COLOR]
    );
    this.#projectionMatrix = this.#calculateProjectionMatrix();
    this.#positions = new ArrayBuffer(gl, 3, WebGLTest.#POSITIONS);
    this.#normals = new ArrayBuffer(gl, 3, WebGLTest.#NORMALS);
    this.#colors = new ArrayBuffer(gl, 4, WebGLTest.#COLORS);
    this.#indices = new ElementArrayBuffer(gl, WebGLTest.#INDICES);
    this.#time = 0;
    this.#rotation = 0;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render(time) {
    time /= 1000;
    const dt = (time - this.#time);
    this.#time = time;
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
    this.#rotation += WebGLTest.ROTATION_SPEED * dt;
    const modelViewMatrix = this.#calculateModelViewMatrix(this.#rotation);
    const normalMatrix = this.#calculateNormalMatrix(modelViewMatrix);
    this.#program.render(new Map([
      [WebGLTest.#UNIFORM_MODEL_VIEW_MATRIX, modelViewMatrix],
      [WebGLTest.#UNIFORM_NORMAL_MATRIX, normalMatrix],
      [WebGLTest.#UNIFORM_PROJECTION_MATRIX, this.#projectionMatrix],
      [WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR, WebGLTest.AMBIENT_LIGHT_COLOR],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR, WebGLTest.DIRECTIONAL_LIGHT_COLOR],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, WebGLTest.DIRECTIONAL_LIGHT_DIRECTION],
    ]));
    this.#positions.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_POSITION));
    this.#normals.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_NORMAL));
    this.#colors.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_COLOR));
    this.#indices.render();
    requestAnimationFrame(time => this.render(time));
  }

  #calculateModelViewMatrix(rotation) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -10.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1]);
    return modelViewMatrix;
  }

  #calculateNormalMatrix(modelViewMatrix) {
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    return normalMatrix;
  }

  #calculateProjectionMatrix() {
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, WebGLTest.FIELD_OF_VIEW, this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight, WebGLTest.NEAR, WebGLTest.FAR);
    return projectionMatrix;
  }
}
