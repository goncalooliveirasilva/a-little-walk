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

    // Bottom planes tend darker
    float height = smoothstep(-1.0, 1.0, position.y);
    vColorMix = aRandom * 0.3 + height * 0.7;

    vec3 pos = position;

    float heightFactor = smoothstep(-0.5, 1.0, pos.y);

    vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
    vec2 windUV = worldPos.xz * 0.05 + uTime * uWindSpeed;
    float noise = texture2D(uNoiseTexture, windUV).r;
    float windOffset = (noise - 0.5) * 2.0;

    pos.x += windOffset * uWindStrength * heightFactor;
    pos.z += windOffset * uWindStrength * heightFactor * 0.5;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}
