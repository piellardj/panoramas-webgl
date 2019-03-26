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
