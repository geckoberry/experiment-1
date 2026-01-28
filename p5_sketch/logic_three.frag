#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_tex_coord;
uniform sampler2D tex;
uniform vec2 u_res;
uniform float u_frame;

float random(vec2 st) {
    return fract(
        sin(dot(st, vec2(12.9898, 78.233)) + u_frame * 0.01)
        * 43758.5453123
    );
}

float byte_from_r(vec4 c) {
  return floor(c.r * 255.0 + 0.5);
}

float unpack_bit(vec4 c, float bit_i) {
  float b = byte_from_r(c);
  return mod(floor(b / pow(2.0, bit_i)), 2.0);
}

float pack_bit0(float is_set) { return (is_set * 1.0) / 255.0; }
float pack_bit1(float is_set) { return (is_set * 2.0) / 255.0; }
float pack_bit2(float is_set) { return (is_set * 4.0) / 255.0; }

float unpack_age(vec4 c) { return floor(c.b * 255.0 + 0.5); }
float pack_age(float age) { return clamp(age, 0.0, 255.0) / 255.0; }

void main() {
  vec2 uv = v_tex_coord;
  uv.y = 1.0 - uv.y;
  
  float a0 = unpack_bit(texture2D(tex, uv), 0.0);
  float a1 = unpack_bit(texture2D(tex, uv), 1.0);
  float a2 = unpack_bit(texture2D(tex, uv), 2.0);
  float age = unpack_age(texture2D(tex, uv));
  float age0 = age; float age1 = age; float age2 = age; 
  float num0 = 0.0; float num1 = 0.0; float num2 = 0.0;
  for (float i = -1.0; i < 2.0; i++) {
    for (float j = -1.0; j < 2.0; j++) {
      vec2 o = vec2(i * u_res.x, j * u_res.y);
      num0 += unpack_bit(texture2D(tex, uv + o), 0.0);
      num1 += unpack_bit(texture2D(tex, uv + o), 1.0);
      num2 += unpack_bit(texture2D(tex, uv + o), 2.0);
    }
  }
  num0 -= a0; num1 -= a1; num2 -= a2;

  if (a0 > 0.5) {
    if (num1 < 1.5) {
      if (num0 < 2.5) a0 = 0.0;
      if (num0 > 5.5) a0 = 0.0;
    }
    if (num2 > 3.5) a0 = 0.0;
    if (age < 1.5 && random(uv) > 0.89) a0 = 0.0; 
    age0++;
  } else {
    if (num1 < 8.5) {
      if (num0 > 2.5 && num0 < 3.5 && num2 < 1.5) {
        a0 = 1.0;
        age0 = 0.0;
      }
    } else {
      if (num0 > 2.5 && num2 < 1.5 && random(uv) > 0.5) {
        a0 = 1.0;
        age0 = 0.0;
      }
    }
  }
  
  if (a1 > 0.5) {
    if (num2 < 0.5) {
      if (num1 < 3.5 || num0 > 2.5) a1 = 0.0;
      if (num1 > 6.5 && random(uv) > 0.97) a1 = 0.0;
    }
    if (num0 > 2.5) a1 = 0.0;
    age1++;
  } else {
    if (num2 < 1.5) {
      if (num1 > 2.5 && num1 < 3.5 && num0 < 1.5) {
        a1 = 1.0;
        age1 = 0.0;
      }
    } else {
      if (num1 > 2.5 && num0 < 1.5) {
        a1 = 1.0;
        age1 = 0.0;
      }
    }
  }

  if (a2 > 0.5) {
    if (num0 < 1.5) {
      if (num2 < 3.5 || num1 > 2.5) a2 = 0.0;
      if (num2 > 6.5 && random(uv) > 0.97) a2 = 0.0;
    }
    age2++;
  } else {
    if (num0 < 1.5) {
      if (num2 > 2.5 && num2 < 3.5) {
        a2 = 1.0;
        age2 = 0.0;
      }
    } else {
      if (num2 > 2.5 && num1 < 1.5) {
        a2 = 1.0;
        age2 = 0.0;
      }
    }
  }
  
  float rand = random(uv);
  // random tiebreak
  if (a0 > 0.5 && a1 > 0.5 && a2 > 0.5) {
    if (rand > 0.67) {
      a1 = 0.0; a2 = 0.0;
      age = age0;
    } else if (rand > 0.33) {
      a0 = 0.0; a2 = 0.0;
      age = age1;
    } else {
      a0 = 0.0; a1 = 0.0;
      age = age2;
    }
  } else if (a0 > 0.5 && a1 > 0.5) {
    if (rand > 0.5) {
      a1 = 0.0;
      age = age0;
    } else {
      a0 = 0.0;
      age = age1;
    }
  } else if (a0 > 0.5 && a2 > 0.5) {
    if (rand > 0.5) {
      a2 = 0.0;
      age = age0;
    } else {
      a0 = 0.0;
      age = age2;
    }
  } else if (a1 > 0.5 && a2 > 0.5) {
    if (rand > 0.5) {
      a2 = 0.0;
      age = age1;
    } else {
      a1 = 0.0;
      age = age2;
    }
  } 
  else if (a0 > 0.5) { age = age0; }
  else if (a1 > 0.5) { age = age1; }
  else if (a2 > 0.5) { age = age2; }
  else { age = 0.0; }

  //prioritize type 0
  // if (a0 > 0.5) {
  //   a1 = 0.0;
  //   age = age0;
  // } else if (a1 > 0.5) {
  //   age = age1;
  // } else {
  //   age = 0.0;
  // }

  float out_r = pack_bit0(a0) + pack_bit1(a1) + pack_bit2(a2);
  float out_b = pack_age(age);
  gl_FragColor = vec4(out_r, 0.0, out_b, 1.0);
}
