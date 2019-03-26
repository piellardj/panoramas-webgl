/* Returns normalized coords.
 * Returns 0 if out of texture, 1 otherwise */
vec3 tinyplanetToSpherical(vec2 coords)
{
    coords -= 0.5;

    float distanceToCenter = length(coords);
    float theta = 2.0 * PI * (0.5 - clamp(0.0, 0.5, distanceToCenter));
    float phi = atan(coords.s, coords.t);

    return vec3(
        sin(theta) * cos(phi),
        sin(theta) * sin(phi),
        cos(theta)
    );
}