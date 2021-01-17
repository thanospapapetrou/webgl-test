class Buffer {
  gl;
  buffer;

  constructor(gl, type, data) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(type, this.buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
  }
}
