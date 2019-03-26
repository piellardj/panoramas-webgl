precision mediump float;

uniform sampler2D uTexture;

uniform float uShowFrame;

varying vec3 fromCamera;

const float PI = 3.14159;

#include "_parameters.frag"

#include "_viewSkysphere.frag"

void main(void)
{
    vec3 adjustedFromEye = adjust(fromCamera);

    vec4 background = sampleSkysphere(uTexture, adjustedFromEye);
    vec4 frame = skysphereFrame(fromCamera);

    vec3 color = mix(background.rgb, frame.rgb, frame.a * uShowFrame);
    gl_FragColor = vec4(color, 1);
}
