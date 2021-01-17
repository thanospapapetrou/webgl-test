class WebGLTest {
  static #AMBIENT_LIGHT_COLOR = [0.3, 0.3, 0.3];
  static #DIRECTIONAL_LIGHT_COLOR = [1, 1, 1];
  static #DIRECTIONAL_LIGHT_DIRECTION = [0.85, 0.8, 0.75];
  static #CANVAS_SELECTOR = '#gl';
  static #COLOR = 'color';
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
  static #FAR = 100;
  static #FIELD_OF_VIEW = Math.PI / 4; // rad
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
  static #MODEL_VIEW = 'modelView';
  static #NEAR = 0.1;
  static #NORMAL = 'normal';
  static #NORMALIZATION = 'normalization';
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
  static #POSITION = 'position';
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
  static #PROJECTION = 'projection';
  static #ROTATION_SPEED = Math.PI; // rad/s
  static #UNIFORM_AMBIENT_LIGHT_COLOR = 'ambientLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'directionalLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'directionalLightDirection';
  static #VERTEX_SHADER = `
    uniform mat4 modelView;
    uniform mat4 normalization;
    uniform mat4 projection;
    uniform vec3 ambientLightColor;
    uniform vec3 directionalLightColor;
    uniform vec3 directionalLightDirection;

    attribute vec4 position;
    attribute vec3 normal;
    attribute vec4 color;

    varying highp vec3 fragmentLight;
    varying lowp vec4 fragmentColor;

    void main(void) {
      gl_Position = projection * modelView * position;
      fragmentLight = ambientLightColor + (directionalLightColor * max(dot((normalization * vec4(normal, 1.0)).xyz, normalize(directionalLightColor)), 0.0));
      fragmentColor = color;
    }
  `;
  static #WEB_GL = 'webgl';

  #gl;
  #program;
  #projection;
  #positions;
  #normals;
  #colors;
  #indices;
  #time;
  #rotation;

  static main() {
    const test = new WebGLTest(document.querySelector(WebGLTest.#CANVAS_SELECTOR).getContext(WebGLTest.#WEB_GL));
    requestAnimationFrame(time => test.render(time));
  }

  constructor(gl) {
    this.#gl = gl;
    this.#program = new Program(gl,
      new VertexShader(gl, WebGLTest.#VERTEX_SHADER),
      new FragmentShader(gl, WebGLTest.#FRAGMENT_SHADER),
      [
        WebGLTest.#MODEL_VIEW,
        WebGLTest.#NORMALIZATION,
        WebGLTest.#PROJECTION,
        WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
      ],
      [
        WebGLTest.#POSITION,
        WebGLTest.#NORMAL,
        WebGLTest.#COLOR]
    );
    this.#projection = this.#calculateProjection();
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
    this.#rotation += WebGLTest.#ROTATION_SPEED * dt;
    const modelView = this.#calculateModelView(this.#rotation);
    const normalization = this.#calculateNormalization(modelView);
    this.#program.render(new Map([
      [WebGLTest.#MODEL_VIEW, modelView],
      [WebGLTest.#NORMALIZATION, normalization],
      [WebGLTest.#PROJECTION, this.#projection],
      [WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR, WebGLTest.#AMBIENT_LIGHT_COLOR],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR, WebGLTest.#DIRECTIONAL_LIGHT_COLOR],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, WebGLTest.#DIRECTIONAL_LIGHT_DIRECTION],
    ]));
    this.#positions.render(this.#program.attributes.get(WebGLTest.#POSITION));
    this.#normals.render(this.#program.attributes.get(WebGLTest.#NORMAL));
    this.#colors.render(this.#program.attributes.get(WebGLTest.#COLOR));
    this.#indices.render();
    requestAnimationFrame(time => this.render(time));
  }

  #calculateModelView(rotation) {
    const modelView = mat4.create();
    mat4.translate(modelView, modelView, [0.0, 0.0, -10.0]);
    mat4.rotate(modelView, modelView, rotation, [1, 0, 0]);
    mat4.rotate(modelView, modelView, rotation, [0, 1, 0]);
    mat4.rotate(modelView, modelView, rotation, [0, 0, 1]);
    return modelView;
  }

  #calculateNormalization(modelView) {
    const normalization = mat4.create();
    mat4.invert(normalization, modelView);
    mat4.transpose(normalization, normalization);
    return normalization;
  }

  #calculateProjection() {
    const projection = mat4.create();
    mat4.perspective(projection, WebGLTest.#FIELD_OF_VIEW, this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight, WebGLTest.#NEAR, WebGLTest.#FAR);
    return projection;
  }
}
