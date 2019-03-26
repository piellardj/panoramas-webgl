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