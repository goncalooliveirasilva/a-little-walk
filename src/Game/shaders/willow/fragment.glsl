#include <fog_pars_fragment>

uniform vec3 uColor;
uniform vec3 uColorDark;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vColorMix;

void main() {
    float textureColor = texture2D(uTexture, vUv).r;
    if (textureColor < 0.5) discard;

    vec3 color = mix(uColor, uColorDark, vColorMix);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
}