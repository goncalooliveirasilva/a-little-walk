uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uWindStrength;
uniform float uWindSpeed;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 pos = position;

    // Vertices higher up sway more, bottom stays grounded
    float heightFactor = smoothstep(-0.5, 1.0, pos.y);

    // Sample wind from noise texture using world XZ and time
    vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
    vec2 windUV = worldPos.xz * 0.05 + uTime * uWindSpeed;
    float noise = texture2D(uNoiseTexture, windUV).r;
    float windOffset = (noise - 0.5) * 2.0;

    // Apply wind displacement scaled by height
    pos.x += windOffset * uWindStrength * heightFactor;
    pos.z += windOffset * uWindStrength * heightFactor * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
}
