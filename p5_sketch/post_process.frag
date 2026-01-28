#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_tex_coord;
uniform sampler2D tex;
uniform vec2 u_res;
uniform float preset;

float byte_from_r(vec4 c) {
  return floor(c.r * 255.0 + 0.5);
}

float unpack_bit(vec4 c, float bit_i) {
  float b = byte_from_r(c);
  return mod(floor(b / pow(2.0, bit_i)), 2.0);
}

void main() {
  vec2 uv = v_tex_coord;
  uv.y = 1.0 - uv.y;

  vec4 c = texture2D(tex, uv);
  float s0 = unpack_bit(c, 0.0);
  float s1 = unpack_bit(c, 1.0);
  float s2 = unpack_bit(c, 2.0);

  vec3 col = vec3(0.0);
  
  if (preset == 0.0) {
    if (s0 > 0.5) {
      col = vec3(max(0.0,0.0-c.b*2.0), 
                 max(0.0,0.7-c.b*20.0), 
                 max(0.0,0.3));
    } else if (s1 > 0.5) {
      col = vec3(max(0.3,1.0-c.b*2.0), 
                 max(0.1,0.7-c.b*5.0), 
                 max(0.0,0.4-c.b*10.0));
    }
  } else if (preset == 1.0) {
    if (s0 > 0.5) {
      col = vec3(min(0.15,c.b*0.2), 
                 max(0.1,0.7-c.b*2.0), 
                 max(0.3,0.5-c.b*1.0));
    } else if (s1 > 0.5) {
      col = vec3(min(0.3,c.b*5.0), 
                 min(0.0,c.b*5.0), 
                 min(0.2,0.2));
    }
  } else if (preset == 2.0) {
    if (s0 > 0.5) {
      col = vec3(0.0, 
                 0.0, 
                 0.0);
    } else if (s1 > 0.5) {
      float fade = smoothstep(0.0, 0.2, c.b) * (1.0 - smoothstep(0.7, 1.0, c.b));
      fade = pow(fade, 0.5);
      col = vec3(max(0.2, (1.0 - c.b * 2.0) * fade),
                 max(0.0, (0.4 - c.b * 10.0) * fade),
                 max(0.07, (1.0 - c.b * 4.0) * fade));
    }
  } else if (preset == 3.0) {
    if (s0 > 0.5) {
      float fade = smoothstep(0.0, 0.2, c.b) * (1.0 - smoothstep(0.7, 1.0, c.b));
      fade = pow(fade, 0.5);
      col = vec3(max(0.25, (0.9 - c.b * 2.0) * fade),
                 max(0.07, (0.5 - c.b * 4.0) * fade),
                 max(0.0, (0.0 - c.b * 4.0) * fade));
    } else if (s1 > 0.5) {
      col = vec3(max(0.3,0.7-c.b*1.0), 
                 max(0.3,0.7-c.b*1.0), 
                 max(0.3,0.6-c.b*1.0));
    } else if (s2 > 0.5) {
      float fade = smoothstep(0.0, 0.2, c.b) * (1.0 - smoothstep(0.7, 1.0, c.b));
      fade = pow(fade, 0.5);
      col = vec3(max(0.0, (0.4 - c.b * 10.0) * fade),
                 max(0.07, (1.0 - c.b * 4.0) * fade),
                 max(0.2, (1.0 - c.b * 2.0) * fade));
    }
  }
  gl_FragColor = vec4(col, 1.0);
}
