// 1, 2, and 3 to select brush
// left and right arrow keys to adjust framerate
// up arrow to change preset

let c_shader, cs_x;
let gb_x, gb_y, gb_z;
let type = 1;
let frame;
let fr;
let preset = 0;
let blur = 1.0;
let tri = false;

function preload() {
  
  // try out the other rulesets by swapping the uncommented line

  c_shader = loadShader("default.vert", "logic_virus.frag"); preset = 0;
  // c_shader = loadShader("default.vert", "logic_lichen.frag"); preset = 1;
  // c_shader = loadShader("default.vert", "logic_burning.frag"); preset = 2, type = 2;
  // c_shader = loadShader("default.vert", "logic_three.frag"); preset = 3; tri = true;
  
  // dont touch this
  p_shader = loadShader("default.vert", "post_process.frag");
  s_shader = loadShader("default.vert", "smooth.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noSmooth();
  fr = 130;
  frame = 0;
  frameRate(fr);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  shader(s_shader);
  p_shader.setUniform("u_res", [1.0/width, 1.0/height]);
  
  gb_x = createGraphics(width, height, WEBGL);
  gb_y = createGraphics(width, height, WEBGL);
  gb_z = createGraphics(width, height, WEBGL);
  gb_x.pixelDensity(1); gb_x.noSmooth();
  gb_y.pixelDensity(1); gb_y.noSmooth();
  gb_z.pixelDensity(1); gb_z.noSmooth();
  gb_y.rectMode(CENTER);
  cs_x = c_shader.copyToContext(gb_x);
  ps_z = p_shader.copyToContext(gb_z);
  gb_x.shader(cs_x);
  gb_z.shader(ps_z);
  cs_x.setUniform("u_res", [1.0/width, 1.0/height]);
  ps_z.setUniform("u_res", [1.0/width, 1.0/height]);
  s_shader.setUniform("u_res", [1.0 / width, 1.0 / height]);
  s_shader.setUniform("u_blur", blur);
}

function keyPressed() {
  if (key === '1') type = 1;
  if (key === '2') type = 2;
  if (key === '3' && tri) type = 4;
  if (keyCode === UP_ARROW && !tri) preset = (preset + 1) % 3;
  if (keyCode === LEFT_ARROW) {
    fr = max(10, fr - 20);
    frameRate(fr);
  }
  if (keyCode === RIGHT_ARROW) {
    fr = min(130, fr + 20);
    frameRate(fr);
  }
}

function draw() {
  if (mouseIsPressed) {
    gb_y.push();
    gb_y.resetMatrix();
    gb_y.translate(-gb_y.width/2, -gb_y.height/2);
    gb_y.fill(type,0,0);
    gb_y.noStroke();
    gb_y.circle(mouseX, mouseY, 7);
    gb_y.pop();
  }
  
  cs_x.setUniform("tex", gb_y);
  cs_x.setUniform("u_frame", frame);
  gb_x.rect(-width/2,-height/2,width,height);
  gb_y.image(gb_x, -gb_y.width/2, -gb_y.height/2);
  
  gb_z.shader(ps_z);
  ps_z.setUniform("tex", gb_x);
  ps_z.setUniform("preset", preset);
  gb_z.rect(-width/2,-height/2,width,height);
  gb_z.resetShader();
  
  shader(s_shader);
  s_shader.setUniform("tex", gb_z);
  noStroke();
  rect(0, 0, width, height);
  resetShader();

  frame++;
}
