class Program {
  attributes;
  #gl;
  #program;
  #uniforms;

  constructor(gl, vertexShader, fragmentShader, uniforms, attributes) {
    this.#gl = gl;
    this.#program = gl.createProgram();
    gl.attachShader(this.#program, vertexShader.shader);
    gl.attachShader(this.#program, fragmentShader.shader);
    gl.linkProgram(this.#program);
    if (!gl.getProgramParameter(this.#program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(this.#program);
      gl.deleteProgram(this.#program);
      this.#program = null;
      throw new LinkingError(error);
    }
    this.#uniforms = new Map();
    uniforms.forEach(uniform =>
      this.#uniforms.set(uniform, gl.getUniformLocation(this.#program, uniform))
    );
    this.attributes = new Map();
    attributes.forEach(attribute =>
      this.attributes.set(attribute, gl.getAttribLocation(this.#program, attribute))
    );
  }

  render(uniforms) {
    this.#gl.useProgram(this.#program);
    uniforms.forEach((value, key) => {
      if (value.length == 3) {
        this.#gl.uniform3fv(this.#uniforms.get(key), value);
      } else if (value.length == 16) {
        this.#gl.uniformMatrix4fv(this.#uniforms.get(key), false, value);
      } else {
        this.#gl.uniform1i(this.#uniforms.get(key), value);
      }
    });
  }
}
