precision mediump float;

uniform samplerCube uTexture;

varying vec2 coords;

const float PI = 3.14159;
uniform float uPaddingTop;
uniform float uPaddingBottom;
uniform float uPaddingBack;
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
/* out param spherical will not be normalized.
 * Returns 0 if out of texture, 1 otherwise */
float skyboxToSpherical(vec2 coords, out vec3 spherical)
{
    coords *= vec2(4, 3);

    if (coords.t < 1.0) {
        if (coords.s < 1.0 || coords.s > 2.0) {
            return 0.0;
        }

        spherical.z = 1.0;
        spherical.xy = 2.0 * (coords.st - vec2(1,0)) - 1.0;
    } else if (coords.t < 2.0) {
        if (coords.s < 1.0) {
            spherical.x = -1.0;
            spherical.yz = 2.0 * (coords.st - vec2(0,1)) - 1.0;
            spherical.z *= -1.0;
        } else if (coords.s < 2.0) {
            spherical.y = 1.0;
            spherical.xz = 2.0 * (coords.st - vec2(1,1)) - 1.0;
            spherical.z *= -1.0;
        } else if (coords.s < 3.0) {
            spherical.x = 1.0;
            spherical.yz = 2.0 * (coords.st - vec2(2,1)) - 1.0;
            spherical.yz *= -1.0;
        } else {
            spherical.y = -1.0;
            spherical.xz = 2.0 * (coords.st - vec2(3,1)) - 1.0;
            spherical.xz *= -1.0;
        }
    } else /* if (coords.t > 2.0) */ {
        if (coords.s < 1.0 || coords.s > 2.0) {
            return 0.0;
        }

        spherical.z = -1.0;
        spherical.xy = 2.0 * (coords.st - vec2(1,2)) - 1.0;
        spherical.y *= -1.0;
    }

    return 1.0;
}
void main(void)
{
    vec3 fromEye;
    float inTex = skyboxToSpherical(coords, fromEye);
    fromEye = adjust(fromEye);

    const vec4 outOfTexColor = vec4(0, 0, 0, 1);
    vec4 sampled = sampleSkybox(uTexture, fromEye);

    gl_FragColor = mix(outOfTexColor, sampled, inTex);
}
