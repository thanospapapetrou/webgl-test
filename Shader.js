class Shader {
  shader;

  constructor(gl, type, source) {
    this.shader = gl.createShader(type);
    gl.shaderSource(this.shader, source);
    gl.compileShader(this.shader);
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(this.shader);
      gl.deleteShader(this.shader);
      this.shader = null;
      throw new CompilationError(error);
    }
  }
}
