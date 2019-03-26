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
