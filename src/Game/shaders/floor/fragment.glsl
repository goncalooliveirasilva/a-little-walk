#include <fog_pars_fragment>

uniform vec3 uBaseColor;
uniform vec3 uShoreColor;
uniform vec3 uDeepColor;
uniform float uDeepToShoreStart;
uniform float uDeepToShoreEnd;
uniform float uShoreToGrassStart;
uniform float uShoreToGrassEnd;

varying float vYModelPosition;

void main() {
    // float mixStrength = vYModelPosition;

    // Here smoothstep guarantees that the transition between colors
    // is much smoother in lakes and montains
    float t1 = smoothstep(uDeepToShoreStart, uDeepToShoreEnd, vYModelPosition);
    float t2 = smoothstep(uShoreToGrassStart, uShoreToGrassEnd, vYModelPosition);

    vec3 color = mix(uDeepColor, uShoreColor, t1);
    color = mix(color, uBaseColor, t2);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
}
