precision mediump float;

uniform sampler2D uTexture;

varying vec2 coords;

const float PI = 3.14159;

#include "_parameters.frag"

#include "_viewSkysphere.frag"

#include "_convertSkybox.frag"

void main(void)
{
    vec3 fromEye;
    float inTex = skyboxToSpherical(coords, fromEye);
    fromEye = adjust(fromEye);

    const vec4 outOfTexColor = vec4(0, 0, 0, 1);
    vec4 sampled = sampleSkysphere(uTexture, fromEye);

    gl_FragColor = mix(outOfTexColor, sampled, inTex);
}
