const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let pitch;
let fd;
let mic;
let freq = 0;
let threshold = 1;

let notes = [
{
note: 
  'A', 
  freq: 
  440
}
, 
{
note: 
  'E', 
  freq: 
  329.6276
}
, 
{
note: 
  'C', 
  freq: 
  261.6256
}
, 
{
note: 
  'G', 
  freq: 
  391.9954
}
];


var figuras = [];

let r;

let img;
let posXfigs, posYfigs, anchoFigs, altoFigs, factorFigs;
var canRender = false;

function preload() {
  for (let i = 0; i < 29; i++ ) {
    figuras[i] = loadImage( "./data/" + i + ".png" );
  }
}


function setup() {
  console.log('setup. creating canvas:');
  
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(initAudio);
  
  text('tap here and enable mic to begin', 10, 20, width - 20);


  ///   
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



  console.log('nos vimos...');
}


function initAudio(){
  console.log('user init audio...');
  userStartAudio(null, () => {
    audioContext = getAudioContext();  
    mic = new p5.AudioIn();
    mic.start(listening);
    console.log('audio running');
  })
}

function listening() {
  console.log('listening');
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
  console.log(pitch);
}

function modelLoaded() {
  console.log('model loaded');
  // pitch.getPitch(gotPitch);
  canRender = true;
  // gotPitch();
  getPitch();
}

function gotPitch() {
  console.log('mic level: '+mic.getLevel());  
  
  // pitch.getPitch((err, frequency) => {
  //   console.log(frequency);
  // });

  // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise  
  // pitch.getPitch().then(    
  //   result => {
  //     if(result) pith = result.freq ? result.freq : 0;  
  //     console.log(pitch);
  //     gotPitch();
  //   },
    
  //   err => {
  //     console.log('nada');
  //     pitch = 0;
  //     gotPitch();
  //   }
  // )
   
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      // select('#result').html(frequency);
      console.log(frequency);
      fd = frequency;
    } else {
      // select('#result').html('No pitch detected');
      console.log('no pitch');
    }
    getPitch();
  })
}



function draw() {

  if( !canRender ) return;
  
  background(0);

  

  if (frameCount%30 == 0) {
    r = int(random(28));
  }

  push();
  
  console.log(typeof pitch);

  var t = map(fd, 800, 1600, 0, 255);
  tint(255, t);
  
  
  image(figuras[r], posXfigs, posYfigs, anchoFigs, altoFigs);

  tint(255);
  image(figuras[28], posXfigs, posYfigs, anchoFigs, altoFigs);

  pop();
  
}
