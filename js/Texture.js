class Texture {
  #gl;
  #texture;

  constructor(gl, texture) {
    this.#gl = gl;
    this.#texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.#texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
    // gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  render() {
    this.#gl.activeTexture(this.#gl.TEXTURE0);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture);
  }
}
