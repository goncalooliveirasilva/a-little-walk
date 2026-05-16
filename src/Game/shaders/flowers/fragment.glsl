#include <fog_pars_fragment>

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    float textureColor = texture2D(uTexture, vUv).r;
    if (textureColor < 0.5) discard;
    
    gl_FragColor = vec4(uColor, textureColor);
    #include <colorspace_fragment>
    #include <fog_fragment>
}