attribute vec2 aCorner; // {-1,1}x{-1,1}

uniform float uPreview;

varying vec2 coords; // {0,1}x{0,1}

void main(void)
{
    coords = vec2(.5, -.5) * aCorner + .5;

    vec2 onScreen = mix(aCorner, .5 * aCorner - .5, uPreview);
    gl_Position = vec4(onScreen, 0, 1);
}
