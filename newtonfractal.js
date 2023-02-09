const PLACING = 0;
const DRAWING = 1;

var center = new cfloat(0, 0);
var radius = 1.5;
var roots = [];
var root_colors = [];
var mode = PLACING;
var tolerance = 0.1;
var color_text;
var directions;
var a = 1;
var declarePixel = 500;
var r_color = 'red';
var autosave = true;

document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);


function setup() {
  var pixels = declarePixel;
  cnv = createCanvas(pixels, pixels);
  cnv.position((window.innerWidth-pixels)/2, 175 );
  cnv.mousePressed(mousePress);
  pixelDensity(1);

  grade_slider = createSlider(3, 7, 3, 1);
  grade_slider.position(85, 280);
  grade_slider.size(200);
  
  grade_val = createP('Grade = ' + grade_slider.value());
  grade_val.position(293, 263);
}


function changeAutosave() {
  if (autosave){
    document.getElementById("savebtn").textContent = "Autosave : OFF";
    autosave = false;
  } else {
    document.getElementById("savebtn").textContent = "Autosave : ON";
    autosave = true;
  }
}

function draw() {
  background(220);
  grade_val.html('Grade = ' + grade_slider.value());
  if (mode == PLACING) {
    drawRoots();
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
      let zMouse = pixelToComplex(createVector(mouseX, mouseY));
      let zre = round(zMouse.re, 3);
      let zim = round(zMouse.im, 3);
      text(zre + " + " + zim + "i", 0, 3);
    }
  } else if (mode == DRAWING) {
    createFractal(a);
    noLoop();
    if (autosave){
      saveCanvas(canvas, 'mi-dibujo', 'png')
    }
  }
}

function complexToPixel(z) {
  let px = map(z.re, center.re - radius, center.re + radius, 0, width);
  let py = map(z.im, center.im - radius, center.im + radius, height, 0);
  return createVector(px, py);
}

function pixelToComplex(vec) {
  let re = map(vec.x, 0, width, center.re - radius, center.re + radius);
  let im = map(vec.y, height, 0, center.im - radius, center.im + radius);
  return new cfloat(re, im);
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomHexColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateRoots(){
  if (mode == PLACING) {
    roots = []
    for (let i = 1; i<= grade_slider.value(); i++){
      var re = getRandomNumber(-1.5, 1.5);
      var im = getRandomNumber(-1.5, 1.5);
      append(roots, new cfloat(re, im));
      append(root_colors, getRandomHexColor());
    }
  }
}
  

function drawRoots() {
  strokeWeight(6);
  for (let i = 0; i < roots.length; i++) {
    stroke(root_colors[i]);
    point(complexToPixel(roots[i]));
  }
}

function f(z) {
  var vec = new cfloat(1, 0);
  for (let i = 0; i < roots.length; i++) {
    var factor = z.sub(roots[i]);
    vec = vec.mult(factor);
  }
  return vec;
}

function df(z) {
  var vec = new cfloat(0, 0);
  for (let j = 0; j < roots.length; j++) {
    var factor = new cfloat(1, 0);
    for (let i = 0; i < roots.length; i++) {
      if (i != j) {
        factor = factor.mult(z.sub(roots[i]));
      }
    }
    vec = vec.add(factor);
  }
  return vec;
}

function newtonsMethod(z, alfa) {
  var n = 0;
  var x = z.copy();
  var sq_dist = 1000;
  while (n < 100 && sq_dist > tolerance * tolerance) {
    var prev = x.copy();
    var fx = f(x);
    var dfx = df(x);
    while (dfx.magSq() == 0) {
      var v = new cfloat(random(0, 0.01), random(0, 0.01));
      dfx = dfx.add(v);
    }
    x = x.sub(fx.div(dfx).scale(alfa));
    sq_dist = x.distSq(prev);
    n++;
  }
  return x;
}

function newtonsMethodN(z,alfa) {
  var n = 0;
  var x = z.copy();
  var sq_dist = 1000;
  while (n < 100 && sq_dist > tolerance * tolerance) {
    var prev = x.copy();
    var fx = f(x);
    var dfx = df(x);
    while (dfx.magSq() == 0) {
      var v = new cfloat(random(0, 0.01), random(0, 0.01));
      dfx = dfx.add(v);
    }
    x = x.sub(fx.div(dfx).scale(alfa));
    sq_dist = x.distSq(prev);
    n++;
  }
  return n;
}

function createFractal(alfa) {
  loadPixels();
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      var pix = (i + j * width) * 4;
      var v = pixelToComplex(createVector(i, j));
      v = newtonsMethod(v,alfa);
      var got_to_root = false;
      for (let k = 0; k < roots.length; k++) {
        var dsq = roots[k].distSq(v);
        if (dsq < tolerance * tolerance) {
          got_to_root = true;
          pixels[pix + 0] = red(root_colors[k]);
          pixels[pix + 1] = green(root_colors[k]);
          pixels[pix + 2] = blue(root_colors[k]);
          pixels[pix + 3] = 255;
          break;
        }
      }
      if (!got_to_root) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
        pixels[pix + 3] = 255;
      }
    }
  }
  updatePixels();
}

function createFractal1(alfa) {
  loadPixels();
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      var pix = (i + j * width) * 4;
      var n = newtonsMethodN(pixelToComplex(createVector(i, j)), alfa);
      var val = map(n, 0, 100, 0, 255);
      pixels[pix + 0] = val;
      pixels[pix + 1] = val;
      pixels[pix + 2] = val;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}


function mousePress() {
  if (mode == PLACING) {
    if (mouseButton == LEFT) {
      var r = pixelToComplex(createVector(mouseX, mouseY));
      append(roots, r);
      append(root_colors, r_color);
    } else if (mouseButton == RIGHT) {
      roots.pop();
      root_colors.pop();
    }
  } else if (mode == DRAWING) {
    var v = pixelToComplex(createVector(mouseX, mouseY));
    if (mouseButton == LEFT) {
      center = v;
      radius /= 2;
    } else if (mouseButton == RIGHT) {
      center = v;
      radius *= 2;
    }
    redraw();
  }
}

function changeMode() {
  const help_text_2 = 'INTERACTIVE NEWTON FRACTAL GENERATOR<br><br>Zoom in on a point by left clicking on it<br>Zoom out from a point, right click on it';
  const help_text_1 = 'INTERACTIVE NEWTON FRACTAL GENERATOR<br><br>- You need at least 3 roots to make a fractal<br><br> - Modified by Marco Nieto';

  if (mode == PLACING && roots.length > 2) {
    mode = DRAWING;
  } else if (mode == DRAWING) {
    mode = PLACING;
    center = new cfloat(0, 0);
    radius = 1.5;
    loop();
    roots = []
  }
}
