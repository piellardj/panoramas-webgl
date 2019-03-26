precision mediump float;

uniform sampler2D uTexture;

uniform float uShowFrame;

varying vec3 fromCamera;

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
vec2 sphericalToTinyplanet(vec3 spherical)
{
    float theta = acos(-spherical.z); // [0, PI]
    float phi = -atan(spherical.y, spherical.x); // [-PI, PI]

    return .5 + .5 * theta / PI * vec2(cos(phi), sin(phi));
}

/* param fromEye is expected to be normalized */
vec4 sampleTinyplanet(sampler2D texture, vec3 fromEye)
{
    vec2 sampleCoords = sphericalToTinyplanet(fromEye);
    return texture2D(texture, sampleCoords);
}

/* param fromEye doesn't have to be normalized */
float tinyplanetFrame(vec3 fromEye)
{
    float theta = acos(fromEye.z); // [0, PI]
    float phi = atan(fromEye.y, fromEye.x); // [-PI, PI]

    float horizontal = step(mod(theta, PI / 5.0), 0.01);
    float vertical = step(mod(phi, PI / 6.0), 0.01);
    return min(1.0, vertical + horizontal);
}
void main(void)
{
    vec3 adjustedFromEye = adjust(fromCamera);

    vec4 background = sampleTinyplanet(uTexture, adjustedFromEye);
    float isOnFrame = tinyplanetFrame(adjustedFromEye);//skysphereFrame(fromCamera);

    const vec3 FRAME_COLOR = vec3(1);
    vec3 color = mix(background.rgb, FRAME_COLOR, isOnFrame * uShowFrame);
    gl_FragColor = vec4(color, 1);
}
