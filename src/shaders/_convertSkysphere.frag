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