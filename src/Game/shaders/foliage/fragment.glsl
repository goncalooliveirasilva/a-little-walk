#include <fog_pars_fragment>

uniform vec3 uColor;
uniform vec3 uColorDark;
uniform sampler2D uAlphaMap;
uniform float uAlphaTest;

varying vec2 vUv;
varying float vColorMix;

void main() {
    float alpha = texture2D(uAlphaMap, vUv).r;
    if (alpha < uAlphaTest) discard;

    vec3 color = mix(uColorDark, uColor, vColorMix);

    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}
