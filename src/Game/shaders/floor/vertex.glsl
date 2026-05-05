#include <fog_pars_vertex>

varying float vYModelPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vYModelPosition = modelPosition.y;

    // Fog needs this
    vec4 mvPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}