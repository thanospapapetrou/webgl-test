class ArrayBuffer extends Buffer {
  #size;

  constructor(gl, size, data) {
    super(gl, gl.ARRAY_BUFFER, new Float32Array(data));
    this.#size = size;
  }

  render(attribute) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(attribute, this.#size, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attribute);
  }
}
