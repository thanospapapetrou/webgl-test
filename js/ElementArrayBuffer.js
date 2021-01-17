class ElementArrayBuffer extends Buffer {
  #size;

  constructor(gl, data) {
    super(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data));
    this.#size = data.length;
  }

  render() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.gl.drawElements(this.gl.TRIANGLES, this.#size, this.gl.UNSIGNED_SHORT, 0);
  }
}
