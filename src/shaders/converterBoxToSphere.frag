precision mediump float;

uniform samplerCube uTexture;

varying vec2 coords;

const float PI = 3.14159;

#include "_parameters.frag"

#include "_viewSkybox.frag"

#include "_convertSkysphere.frag"

void main(void)
{
    vec3 fromEye = skysphereToSpherical(coords);
    fromEye = adjust(fromEye);

    gl_FragColor = sampleSkybox(uTexture, fromEye);
}
