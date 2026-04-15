#include <common>
#include <fog_pars_fragment>
#include <lights_pars_begin>

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

    // Diffuse response to the sun
    vec3 normal = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    vec3 lightDir = normalize(directionalLights[0].direction);
    float diffuse = max(dot(normal, lightDir), 0.0);
    color *= 0.4 + 0.6 * diffuse * directionalLights[0].color;

    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}
