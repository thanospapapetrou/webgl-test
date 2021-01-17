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
      alert('Error linking program: ' + gl.getProgramInfoLog(this.#program));
      gl.deleteProgram(this.#program);
      this.#program = null;
      return;
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
    uniforms.forEach((value, key) => this.#gl.uniformMatrix4fv(this.#uniforms.get(key), false, value));
  }
}
