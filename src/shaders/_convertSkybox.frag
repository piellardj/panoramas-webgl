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