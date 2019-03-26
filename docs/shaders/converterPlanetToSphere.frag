precision mediump float;

uniform sampler2D uTexture;

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
}/* Returns normalized coords */
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

    gl_FragColor = sampleTinyplanet(uTexture, fromEye);
}
