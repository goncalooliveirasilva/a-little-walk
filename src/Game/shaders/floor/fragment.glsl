uniform vec3 uBaseColor;
uniform vec3 uDownColor;
uniform float uMixStart;
uniform float uMixEnd;

varying float vYModelPosition;

void main() {

    // float mixStrength = vYModelPosition;

    // Here smoothstep guarantees that the transition between colors
    // is much smoother in lakes and montains
    float mixStrength = smoothstep(uMixStart, uMixEnd, vYModelPosition);

    vec3 color = mix(uDownColor, uBaseColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}