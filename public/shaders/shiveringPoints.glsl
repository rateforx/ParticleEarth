uniform float size;
uniform float scale;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform float uScale;
uniform vec2 uResolution;
uniform float uTime;

varying vec3 newPosition;

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

float random ( vec2 st ) {
    return fract( sin( dot( st.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453123 );
}

void main () {
    #include <color_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <project_vertex>
    #ifdef USE_SIZEATTENUATION
        gl_PointSize = size * ( scale / - mvPosition.z );
    #else
        gl_PointSize = size;
    #endif
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    #include <worldpos_vertex>
    #include <fog_vertex>

    vec2 st = position.xy / uResolution.xy;
    vec3 normal = normalize(position.xyz);
    float rand = random( st * uTime );
    vec3 right = cross(normal, vec3(0,1,0));
    mat4 rot = rotationMatrix(normal, rand);
    newPosition = position + (right * 0.1 * rand);
    gl_Position = projectionMatrix * modelViewMatrix * rot * vec4( newPosition, 1.0 );
}