#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_tex_coord;
uniform sampler2D tex;
uniform vec2 u_res;
uniform float u_blur;

vec4 sampleTex(vec2 uv) {
  return texture2D(tex, uv);
}

vec4 blur9(vec2 uv, vec2 texel) {
  vec4 c = vec4(0.0);
  c += sampleTex(uv + texel * vec2(-1.0, -1.0)) * 0.0625;
  c += sampleTex(uv + texel * vec2( 0.0, -1.0)) * 0.1250;
  c += sampleTex(uv + texel * vec2( 1.0, -1.0)) * 0.0625;

  c += sampleTex(uv + texel * vec2(-1.0,  0.0)) * 0.1250;
  c += sampleTex(uv)                               * 0.2500;
  c += sampleTex(uv + texel * vec2( 1.0,  0.0)) * 0.1250;

  c += sampleTex(uv + texel * vec2(-1.0,  1.0)) * 0.0625;
  c += sampleTex(uv + texel * vec2( 0.0,  1.0)) * 0.1250;
  c += sampleTex(uv + texel * vec2( 1.0,  1.0)) * 0.0625;

  return c;
}

void main() {
  vec2 uv = v_tex_coord;
  uv.y = 1.0-uv.y;
  float b = max(u_blur, 0.0);
  vec2 t = u_res * b;
  vec4 original = sampleTex(uv);
  vec4 blurred  = blur9(uv, t);
  vec4 outCol = blurred;
  gl_FragColor = outCol;
}
