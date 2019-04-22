precision mediump float;

uniform samplerCube uTexture;

varying vec2 coords;

const float PI = 3.14159;uniform float uPaddingTop;
uniform float uPaddingBottom;
uniform float uPaddingBack;
uniform float uRotateZ;
uniform float uFlipVertically;

/* param fromCamera doesn't have to be normalized.
 * out param fromCamera will be normalized.
 * Returns 0 if out of scope, 1 otherwise */
vec3 adjust(vec3 fromCamera) {
    fromCamera = normalize(fromCamera);

    float theta = acos(fromCamera.z * uFlipVertically); // [0, PI]
    float phi = atan(fromCamera.y, fromCamera.x); // [-PI, PI]

    // /* Handle margins */
    theta = theta * (1.0 + uPaddingTop + uPaddingBottom) - PI * uPaddingTop;
    phi = phi * (1.0 + uPaddingBack);

    theta = clamp(theta, 0.0, PI);
    phi = clamp(phi, -PI, PI);

    phi = mod(phi + PI * (1.0 + 2.0 * uRotateZ), 2.0 * PI) - PI;

    return vec3(
        sin(theta) * cos(phi),
        sin(theta) * sin(phi),
        cos(theta)
    );
}
/* param fromEye is expected to be normalized */
vec4 sampleSkybox(samplerCube texture, vec3 fromEye)
{
    return textureCube(texture, fromEye);
}

/* param fromEye doesn't have to be normalized */
float skyboxFrame(vec3 fromEye)
{
    vec3 absFromEye = abs(fromEye);
    absFromEye /= max(absFromEye.x, max(absFromEye.y, absFromEye.z));

    const float THICKNESS = 0.01;
    const float ALMOST_TWO = 1.9;
    vec3 tmp = step(absFromEye, vec3(1.0 - THICKNESS));
    return step(tmp.r + tmp.g + tmp.b, ALMOST_TWO);
}
/* Returns normalized coords */
vec3 skysphereToSpherical(vec2 coords)
{
    coords = PI * vec2(-2.0 * coords.s + 1.0, coords.t);

    return vec3(
        sin(coords.t) * cos(coords.s),
        sin(coords.t) * sin(coords.s),
        cos(coords.t)
    );
}
void main(void)
{
    vec3 fromEye = skysphereToSpherical(coords);
    fromEye = adjust(fromEye);

    gl_FragColor = sampleSkybox(uTexture, fromEye);
}
