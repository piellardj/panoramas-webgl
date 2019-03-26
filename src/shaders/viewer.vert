uniform mat4 uProjToWorld; //=(invView wihtout translations) * invProj

attribute vec2 aCorner; // {-1,1}x{-1,1}

varying vec3 fromCamera;

void main(void)
{
    fromCamera = (uProjToWorld * vec4(aCorner, 0, 1)).xyz;
    gl_Position = vec4(aCorner, 0, 1);
}
