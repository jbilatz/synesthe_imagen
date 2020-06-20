
var figuras = [];

let r;

let img;
let posXfigs, posYfigs, anchoFigs, altoFigs, factorFigs;


function preload() {
  //img = loadImage('data/12.png');

  for (let i = 0; i < 29; i++ ) {
    figuras[i] = loadImage( "./data/" + i + ".png" );
  }
}


function setup() {
  //createCanvas(1280, 720);
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);

  posXfigs = width/2;
  posYfigs = height/2;

  r = int(random(28));

  factorFigs = 1.2432;

  if ( width/height >= factorFigs) {
    altoFigs = height;
    anchoFigs = height*factorFigs;
  } else {
    anchoFigs = width;
    altoFigs = width/factorFigs;
  }
}


function draw() {
  background(0);

  if (frameCount%30 == 0) {
    r = int(random(28));
  }




  push();

  tint(255, mouseY/2);
  image(figuras[r], posXfigs, posYfigs, anchoFigs, altoFigs);

  tint(255);
  image(figuras[28], posXfigs, posYfigs, anchoFigs, altoFigs);

  push();
}
