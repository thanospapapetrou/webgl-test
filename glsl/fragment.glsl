uniform sampler2D texture;

varying highp vec3 fragmentLight;
varying highp vec2 fragmentTextureCoordinates;
varying highp vec4 fragmentColor;

void main(void) {
  highp vec4 texel = texture2D(texture, fragmentTextureCoordinates);
  gl_FragColor = vec4(mix(fragmentColor.rgb, texel.rgb, texel.a) * fragmentLight, fragmentColor.a);
}
