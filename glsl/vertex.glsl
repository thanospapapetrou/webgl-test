uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;
uniform mat4 projectionMatrix;
uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor;
uniform vec3 directionalLightDirection;

attribute vec4 position;
attribute vec3 normal;
attribute vec4 color;

varying highp vec3 fragmentLight;
varying lowp vec4 fragmentColor;

void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * position;
  fragmentLight = ambientLightColor + (directionalLightColor * max(dot((normalMatrix * vec4(normal, 1.0)).xyz, normalize(directionalLightColor)), 0.0));
  fragmentColor = color;
}
