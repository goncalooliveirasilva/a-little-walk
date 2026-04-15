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

    // Diffuse response to the sun
    vec3 normal = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    vec3 lightDir = normalize(directionalLights[0].direction);
    float diffuse = max(dot(normal, lightDir), 0.0);
    color *= 0.4 + 0.6 * diffuse * directionalLights[0].color;

    // Shadow from any shadow-casting light in the scene
    float shadow = getShadowMask();
    color *= mix(0.55, 1.0, shadow);

    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}