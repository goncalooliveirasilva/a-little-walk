#include <fog_pars_vertex>

uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uWindStrength;
uniform float uWindSpeed;

attribute float aRandom;

varying vec2 vUv;
varying float vColorMix;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

    // For the colors
    float height = smoothstep(-1.0, 1.0, position.y);
    vColorMix = aRandom * 0.2 + (1.0 - height) * 0.8;

    // Wind
    vec2 windUV = modelPosition.xz * 0.05 + uTime * uWindSpeed;
    float noise = texture2D(uNoiseTexture, windUV).r; // [0.0, 1.0]
    float windOffset = (noise - 0.5) * 2.0;

    // bottom sways more in this case
    float heightFactor = smoothstep(-1.0, 0.5, position.y);

    modelPosition.x += windOffset * uWindStrength * (1.0 - heightFactor);
    modelPosition.z += windOffset * uWindStrength * 0.5 * (1.0 - heightFactor);

    // Fog need this separated
    vec4 mvPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}