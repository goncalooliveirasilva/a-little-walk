#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform vec3 uBaseColor;
uniform vec3 uTipColor;
uniform sampler2D uNoiseTexture;
uniform float uColorVariation;

varying float vTipness;
varying vec2 vBladePos;

void main() {
    vec3 color = mix(uBaseColor, uTipColor, vTipness);

    // Sample noise at blade position
    float noise = texture2D(uNoiseTexture, vBladePos * 0.1).r;
    // Shift color
    color *= mix(1.0 - uColorVariation, 1.0 + uColorVariation, noise);

    // Shadow from any shadow-casting light in the scene
    float shadow = getShadowMask();
    color *= mix(0.55, 1.0, shadow);

    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}