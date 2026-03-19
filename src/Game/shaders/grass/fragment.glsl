uniform vec3 uBaseColor;
uniform vec3 uTipColor;

varying float vTipness;

void main() {
    vec3 color = mix(uBaseColor, uTipColor, vTipness);
    gl_FragColor = vec4(color, 1.0);
}