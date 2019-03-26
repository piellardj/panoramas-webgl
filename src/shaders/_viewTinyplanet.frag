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