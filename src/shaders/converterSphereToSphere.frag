precision mediump float;

uniform sampler2D uTexture;

varying vec2 coords;

const float PI = 3.14159;

#include "_parameters.frag"

#include "_viewSkysphere.frag"

#include "_convertSkysphere.frag"

void main(void)
{
    vec3 fromEye = skysphereToSpherical(coords);
    fromEye = adjust(fromEye);

    gl_FragColor = sampleSkysphere(uTexture, fromEye);
}