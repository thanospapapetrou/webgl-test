class WebGLTest {
  static #ATTRIBUTE_COLOR = 'color';
  static #ATTRIBUTE_NORMAL = 'normal';
  static #ATTRIBUTE_POSITION = 'position';
  static #ATTRIBUTE_TEXTURE_COORDINATES = 'textureCoordinates';
  static #DATA_COLORS = './data/colors.json';
  static #DATA_CONFIGURATION = './data/configuration.json';
  static #DATA_INDICES = './data/indices.json';
  static #DATA_NORMALS = './data/normals.json';
  static #DATA_POSITIONS = './data/positions.json';
  static #DATA_TEXTURE = './data/texture.png';
  static #DATA_TEXTURE_COORDINATES = './data/textureCoordinates.json';
  static #ERROR_LOADING_TEXTURE = 'Error loading texture';
  static #HTTP_METHOD_GET = 'GET';
  static #HTTP_STATUS_OK = 200;
  static #RESPONSE_TYPE_JSON = 'json';
  static #RESPONSE_TYPE_TEXT = 'text';
  static #SELECTOR_CANVAS = '#gl';
  static #SELECTOR_FPS = '#fps';
  static #SHADER_FRAGMENT = './glsl/fragment.glsl';
  static #SHADER_VERTEX = './glsl/vertex.glsl';
  static #UNIFORM_AMBIENT_LIGHT_COLOR = 'ambientLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'directionalLightColor';
  static #UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'directionalLightDirection';
  static #UNIFORM_MODEL_VIEW_MATRIX = 'modelViewMatrix';
  static #UNIFORM_NORMAL_MATRIX = 'normalMatrix';
  static #UNIFORM_PROJECTION_MATRIX = 'projectionMatrix';
  static #UNIFORM_TEXTURE = 'texture';
  static #WEB_GL_CONTEXT = 'webgl';

  #gl;
  #program;
  #texture;
  #positions;
  #normals;
  #textureCoordinates;
  #colors;
  #indices;
  #configuration;
  #fps;
  #projectionMatrix;
  #time;
  #rotation;

  static main() {
    const gl = document.querySelector(WebGLTest.#SELECTOR_CANVAS).getContext(WebGLTest.#WEB_GL_CONTEXT);
    const fps = document.querySelector(WebGLTest.#SELECTOR_FPS);
    WebGLTest.#loadData(WebGLTest.#SHADER_VERTEX, WebGLTest.#RESPONSE_TYPE_TEXT).then(vertexShader => {
      WebGLTest.#loadData(WebGLTest.#SHADER_FRAGMENT, WebGLTest.#RESPONSE_TYPE_TEXT).then(fragmentShader => {
        WebGLTest.#loadTexture(WebGLTest.#DATA_TEXTURE).then(texture => {
          WebGLTest.#loadData(WebGLTest.#DATA_POSITIONS, WebGLTest.#RESPONSE_TYPE_JSON).then(positions => {
            WebGLTest.#loadData(WebGLTest.#DATA_NORMALS, WebGLTest.#RESPONSE_TYPE_JSON).then(normals => {
              WebGLTest.#loadData(WebGLTest.#DATA_TEXTURE_COORDINATES, WebGLTest.#RESPONSE_TYPE_JSON).then(textureCoordinates => {
                WebGLTest.#loadData(WebGLTest.#DATA_COLORS, WebGLTest.#RESPONSE_TYPE_JSON).then(colors => {
                  WebGLTest.#loadData(WebGLTest.#DATA_INDICES, WebGLTest.#RESPONSE_TYPE_JSON).then(indices => {
                    WebGLTest.#loadData(WebGLTest.#DATA_CONFIGURATION, WebGLTest.#RESPONSE_TYPE_JSON).then(configuration => {
                      const test = new WebGLTest(gl, vertexShader, fragmentShader, texture, positions, normals, textureCoordinates, colors, indices, configuration, fps);
                      requestAnimationFrame(time => test.render(time));
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  static #loadData(url, type) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.responseType = type;
      request.onload = function() {
        if (this.status == WebGLTest.#HTTP_STATUS_OK) {
          resolve(this.response);
        } else {
          reject(new LoadingError(this.status, this.statusText));
        }
      };
      request.onerror = function() {
        reject(new LoadingError(this.status, this.statusText));
      };
      request.open(WebGLTest.#HTTP_METHOD_GET, url, true);
      request.send();
    });
  }

  static #loadTexture(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function() {
        resolve(this);
      };
      image.onerror = function() {
        reject(new LoadingError(0, WebGLTest.#ERROR_LOADING_TEXTURE));
      };
      image.src = url;
    });
  }

  constructor(gl, vertexShader, fragmentShader, texture, positions, normals, textureCoordinates, colors, indices, configuration, fps) {
    this.#gl = gl;
    this.#program = new Program(gl,
      new VertexShader(gl, vertexShader),
      new FragmentShader(gl, fragmentShader),
      [
        WebGLTest.#UNIFORM_MODEL_VIEW_MATRIX,
        WebGLTest.#UNIFORM_NORMAL_MATRIX,
        WebGLTest.#UNIFORM_PROJECTION_MATRIX,
        WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR,
        WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION,
        WebGLTest.#UNIFORM_TEXTURE
      ],
      [
        WebGLTest.#ATTRIBUTE_POSITION,
        WebGLTest.#ATTRIBUTE_NORMAL,
        WebGLTest.#ATTRIBUTE_TEXTURE_COORDINATES,
        WebGLTest.#ATTRIBUTE_COLOR]
    );
    this.#texture = new Texture(gl, texture);
    this.#positions = new ArrayBuffer(gl, positions.size, positions.data);
    this.#normals = new ArrayBuffer(gl, normals.size, normals.data);
    this.#textureCoordinates = new ArrayBuffer(gl, textureCoordinates.size, textureCoordinates.data);
    this.#colors = new ArrayBuffer(gl, colors.size, colors.data);
    this.#indices = new ElementArrayBuffer(gl, indices.data);
    this.#configuration = configuration;    this.#fps = fps;
    this.#projectionMatrix = this.#calculateProjectionMatrix();
    this.#time = 0;
    this.#rotation = 0;
    new EventListener();
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
    this.#rotation += this.#configuration.rotationSpeed * dt;
    const modelViewMatrix = this.#calculateModelViewMatrix(this.#rotation);
    const normalMatrix = this.#calculateNormalMatrix(modelViewMatrix);
    this.#texture.render();
    this.#program.render(new Map([
      [WebGLTest.#UNIFORM_MODEL_VIEW_MATRIX, modelViewMatrix],
      [WebGLTest.#UNIFORM_NORMAL_MATRIX, normalMatrix],
      [WebGLTest.#UNIFORM_PROJECTION_MATRIX, this.#projectionMatrix],
      [WebGLTest.#UNIFORM_AMBIENT_LIGHT_COLOR, this.#configuration.light.ambient.color],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_COLOR, this.#configuration.light.directional.color],
      [WebGLTest.#UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.#configuration.light.directional.direction],
      [WebGLTest.#UNIFORM_TEXTURE, 0]
    ]));
    this.#positions.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_POSITION));
    this.#normals.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_NORMAL));
    this.#textureCoordinates.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_TEXTURE_COORDINATES));
    this.#colors.render(this.#program.attributes.get(WebGLTest.#ATTRIBUTE_COLOR));
    this.#indices.render();
    this.#fps.textContent = Math.round(1 / dt);
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
    mat4.perspective(projectionMatrix, this.#configuration.projection.fieldOfView, this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight, this.#configuration.projection.near, this.#configuration.projection.far);
    return projectionMatrix;
  }
}
