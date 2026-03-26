uniform vec3 uColor;
uniform sampler2D uAlphaMap;
uniform float uAlphaTest;

varying vec2 vUv;

void main() {
    float alpha = texture2D(uAlphaMap, vUv).r;
    if (alpha < uAlphaTest) discard;

    gl_FragColor = vec4(uColor, 1.0);
}
