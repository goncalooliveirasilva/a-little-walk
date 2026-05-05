varying float vYModelPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vYModelPosition = modelPosition.y;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
} 