precision mediump float;

uniform sampler2D uTexture;

uniform float uShowFrame;

varying vec3 fromCamera;

const float PI = 3.14159;

#include "_parameters.frag"

#include "_viewTinyplanet.frag"

void main(void)
{
    vec3 adjustedFromEye = adjust(fromCamera);

    vec4 background = sampleTinyplanet(uTexture, adjustedFromEye);
    float isOnFrame = tinyplanetFrame(adjustedFromEye);//skysphereFrame(fromCamera);

    const vec3 FRAME_COLOR = vec3(1);
    vec3 color = mix(background.rgb, FRAME_COLOR, isOnFrame * uShowFrame);
    gl_FragColor = vec4(color, 1);
}
