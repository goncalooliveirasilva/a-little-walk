uniform float uBladeWidth;
uniform float uBladeHeight;
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform sampler2D uDensityMap;
uniform float uWindStrength;
uniform float uWindSpeed;
uniform vec2 uPlayerPosition;
uniform float uGrassSize;
uniform float uWorldSize;

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>

attribute float aRandom;
varying float vTipness;
varying vec2 vBladePos;

void main() {
    vec2 base = position.xy;

    // Which vertex of the triangle
    // 0 = tip, 1 = bottom-left, 2 = bottom-right
    int vertexId = gl_VertexID % 3;

    // 1.0 at tip, 0.0 at base
    float tipness = vertexId == 0 ? 1.0 : 0.0;
    vTipness = tipness;

    // wrap position
    vec2 gridSize = vec2(uGrassSize);
    vec2 halfGrid = gridSize * 0.5;
    base -= uPlayerPosition;
    base = mod(base + halfGrid, gridSize) - halfGrid;
    base += uPlayerPosition;

    vec3 bladeWorldPos = vec3(base.x, 0.0, base.y);
    vBladePos = bladeWorldPos.xz;
    vec3 offset = vec3(0.0);

    // Sample density map (world position to 0-1 UV)
    vec2 densityUV = bladeWorldPos.xz / uWorldSize + 0.5;
    float density = texture2D(uDensityMap, densityUV).r;

    // Hide blade if density is too low
    if (density < 0.1) {
        gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    // Height varies between 40% and 100% based on random
    float height = uBladeHeight * mix(0.4, 1.0, aRandom);

    if (vertexId == 0) {
        offset.y = height;
    } else if (vertexId == 1) {
        offset.x = -uBladeWidth;
    } else {
        offset.x = uBladeWidth;
    }

    // Wind
    vec2 windUV = bladeWorldPos.xz * 0.05 + uTime * uWindSpeed;
    float noise = texture2D(uNoiseTexture, windUV).r;
    // Remap from [0, 1] to [-1, 1]
    float windOffset = (noise - 0.5) * 2.0;
    // Only affect the tip, scaled by strength and height
    offset.x += windOffset * uWindStrength * tipness * height;
    offset.z += windOffset * uWindStrength * tipness * height * 0.5;

    // Angle from blade to camera (on the XZ plane)
    float angle = atan(
        bladeWorldPos.z - cameraPosition.z,
        bladeWorldPos.x - cameraPosition.x
    ) + 1.5708;

    // Rotate the offset around Y axis
    float c = cos(angle);
    float s = sin(angle);
    vec3 rotatedOffset = vec3(
        offset.x * c - offset.z * s,
        offset.y,
        offset.x * s + offset.z * c
    );

    vec3 pos = bladeWorldPos + rotatedOffset;

    // Needed by shadowmap_vertex chunk
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vec3 objectNormal = vec3(0.0, 1.0, 0.0);
    vec3 transformedNormal = vec3(0.0, 1.0, 0.0);

    #include <shadowmap_vertex>

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}