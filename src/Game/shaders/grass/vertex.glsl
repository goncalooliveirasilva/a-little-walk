uniform float uBladeWidth;
uniform float uBladeHeight;

attribute float aRandom;
varying float vTipness;

void main() {
    vec2 base = position.xy;

    // Which vertex of the triangle
    // 0 = tip, 1 = bottom-left, 2 = bottom-right
    int vertexId = gl_VertexID % 3;

    vTipness = vertexId == 0 ? 1.0 : 0.0;

    vec3 bladeWorldPos = vec3(base.x, 0.0, base.y);
    vec3 offset = vec3(0.0);

    // Height varies between 40% and 100% based on random
    float height = uBladeHeight * mix(0.4, 1.0, aRandom);

    if (vertexId == 0) {
        offset.y = height;
    } else if (vertexId == 1) {
        offset.x = - uBladeWidth;
    } else {
        offset.x = uBladeWidth;
    }

    // Angle from blade to camera (on the XZ plane)
    float angle = atan(
        bladeWorldPos.z - cameraPosition.z,
        bladeWorldPos.x - cameraPosition.x
    ) + 1.5708; // + PI/2 to face the camera

    // Rotate the offset around Y axis
    float c = cos(angle);
    float s = sin(angle);
    vec3 rotatedOffset = vec3(
        offset.x * c - offset.z * s,
        offset.y,
        offset.x * s + offset.z * c
    );

    vec3 pos = bladeWorldPos + rotatedOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}