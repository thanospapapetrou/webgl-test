varying highp vec3 fragmentLight;
varying lowp vec4 fragmentColor;

void main(void) {
  gl_FragColor = vec4(fragmentColor.rgb * fragmentLight, fragmentColor.a);
}
