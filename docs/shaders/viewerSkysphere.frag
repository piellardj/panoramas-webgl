precision mediump float;

uniform sampler2D uTexture;

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
vec2 sphericalToSkysphere(vec3 spherical)
{
    /* invert X axis */
    float theta = acos(spherical.z); // [0, PI]
    float phi = -atan(spherical.y, spherical.x); // [-PI, PI]

    vec2 skysphere = vec2(.5 * (phi + PI), theta) / PI;

    return skysphere;
}

/* param fromEye is expected to be normalized */
vec4 sampleSkysphere(sampler2D texture, vec3 fromEye)
{
    vec2 sampleCoords = sphericalToSkysphere(fromEye);
    return texture2D(texture, sampleCoords);
}

/* param fromEye doesn't have to be normalized */
vec4 skysphereFrame(vec3 fromEye)
{
    vec3 absFromEye = abs(normalize(fromEye));
    vec3 color = step(absFromEye, vec3(0.004)); //red, green, blue lines
    color += step(0.9998, absFromEye.z); //white circles on top and bottom
    return vec4(color, max(color.r, max(color.g, color.b)));
}
void main(void)
{
    vec3 adjustedFromEye = adjust(fromCamera);

    vec4 background = sampleSkysphere(uTexture, adjustedFromEye);
    vec4 frame = skysphereFrame(fromCamera);

    vec3 color = mix(background.rgb, frame.rgb, frame.a * uShowFrame);
    gl_FragColor = vec4(color, 1);
}
