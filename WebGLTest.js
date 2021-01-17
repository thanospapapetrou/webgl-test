class WebGLTest {
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
    varying lowp vec4 fragmentColor;

    void main(void) {
      gl_FragColor = fragmentColor;
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
  static #VERTEX_SHADER = `
    uniform mat4 modelView;
    uniform mat4 projection;

    attribute vec4 position;
    attribute vec4 color;

    varying lowp vec4 fragmentColor;

    void main(void) {
      gl_Position = projection * modelView * position;
      fragmentColor = color;
    }
  `;
  static #WEB_GL = 'webgl';

  #gl;
  #program;
  #projection;
  #positions;
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
      [WebGLTest.#MODEL_VIEW, WebGLTest.#PROJECTION],
      [WebGLTest.#POSITION, WebGLTest.#COLOR]
    );
    this.#projection = this.#calculateProjection();
    this.#positions = new ArrayBuffer(gl, 3, WebGLTest.#POSITIONS);
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
    this.#program.render(new Map([[WebGLTest.#MODEL_VIEW, modelView], [WebGLTest.#PROJECTION, this.#projection]]));
    this.#positions.render(this.#program.attributes.get(WebGLTest.#POSITION));
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

  #calculateProjection() {
    const projection = mat4.create();
    mat4.perspective(projection, WebGLTest.#FIELD_OF_VIEW, this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight, WebGLTest.#NEAR, WebGLTest.#FAR);
    return projection;
  }
}
