uniform vec3 uTopColor;
uniform vec3 uHorizonColor;
uniform float uHorizonStart;
uniform float uHorizonEnd;

varying vec3 vWorldPosition;

void main() {
  float h = normalize(vWorldPosition).y;
  float t = smoothstep(uHorizonStart, uHorizonEnd, h);
  vec3 col = mix(uHorizonColor, uTopColor, t);
  gl_FragColor = vec4(col, 1.0);
}
