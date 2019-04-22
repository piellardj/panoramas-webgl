precision mediump float;

uniform samplerCube uTexture;

uniform float uShowFrame;

varying vec3 fromCamera;

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

void main(void)
{
    vec3 adjustedFromEye = adjust(fromCamera);

    vec4 background = sampleSkybox(uTexture, adjustedFromEye);
    float isOnFrame = skyboxFrame(fromCamera);

    const vec3 FRAME_COLOR = vec3(1);
    vec3 color = mix(background.rgb, FRAME_COLOR, isOnFrame * uShowFrame);
    gl_FragColor = vec4(color, 1);
}
