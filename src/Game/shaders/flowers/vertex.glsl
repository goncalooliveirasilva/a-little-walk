#include <fog_pars_vertex>

uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uWindStrength;
uniform float uWindSpeed;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

    // Wind
    vec2 windUV = modelPosition.xz * 0.05 + uTime * uWindSpeed;
    float noise = texture2D(uNoiseTexture, windUV).r; // [0.0, 1.0]
    float windOffset = (noise - 0.5) * 2.0;

    modelPosition.x += windOffset * uWindStrength;
    modelPosition.z += windOffset * uWindStrength * 0.5;

    // Fog needs this
    vec4 mvPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}