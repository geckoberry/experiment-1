attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 v_tex_coord;

void main() {
  v_tex_coord = aTexCoord;
  vec4 pos_vec4 = vec4(aPosition, 1.0);
  pos_vec4.xy = pos_vec4.xy * 2.0 - 1.0;
  gl_Position = pos_vec4;
}