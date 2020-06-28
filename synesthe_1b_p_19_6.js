const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

var figuras = [];

let pitch;  // el detector
let fd;
let mlevel, micNivelRegistrado;     // ;p detectadp
let mic;    // el mic
let midiNote;
let indiceFigura;
let transparencia;
let mostrarFiguras;
let unbralSupMic, umbralInfMic;

// let r;
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
  // muestra una indicacion de lo que tiene que hacer el usuario
  textSize(16);
  textLeading(30); // Set leading to 10
  text('clickear/tocar aquí para habilitar el mic y empezar\nclick/tap here and enable mic to begin', 40, 30, width - 40);
  
  imageMode(CENTER);
  posXfigs = width/2;
  posYfigs = height/2;

  // r = int(random(28));

  factorFigs = 1.2432;

  if ( width/height >= factorFigs) {
    altoFigs = height;
    anchoFigs = height*factorFigs;
  } else {
    anchoFigs = width;
    altoFigs = width/factorFigs;
  }
  console.log('nos vimos...');

  transparencia = 0;
  mostrarFiguras = false;

  unbralSupMic = 0.015;
  umbralInfMic = 0.003;
  indiceFigura = 0;
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
  // console.log(pitch);
}

function modelLoaded() {
  console.log('model loaded');
  getPitch();
  canRender = true;
  cnv.mousePressed(() => console.log('puto el que lee'));
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      // console.log("frequency: "+frequency);
      fd = frequency;
    } else {
      // console.log('no pitch');
    }
    getPitch();
  })
}

function draw() {

  if( !canRender ) return;
  
  background(0);
  
  // console.log(typeof pitch);
  mlevel = mic.getLevel();
  
  // console.log('mic level: '+mic.getLevel());
  // console.log('mic level es un número?: ' + !isNaN(mlevel) );
  // var t = map(fd, 800, 1600, 0, 255);

  if(mlevel > unbralSupMic){
    console.log('mic level: '+mic.getLevel());
    micNivelRegistrado = mlevel;

    mostrarFiguras = true;
    console.log('mostrarFiguras: '+mostrarFiguras);

    midiNote = int(69+12*(log((fd)/440)));
    console.log('midiNote: '+midiNote);
    indiceFigura = midiNote - 48;
    console.log('indiceFigura: '+indiceFigura);
    fill(255);
    text('nota: ' + midiNote, 40, 30, width - 40);
  

  }

  // var transp = 255;

  if(mostrarFiguras){

    if(!isNaN(mlevel)){

      transparencia = map(mlevel, 0, micNivelRegistrado, 0, 255);
      console.log('transparencia: '+transparencia);
    }



    push();

    tint(255, transparencia);
    if(indiceFigura =>0 && indiceFigura < figuras.length ){

      image(figuras[indiceFigura], posXfigs, posYfigs, anchoFigs, altoFigs);

    }
  
    pop();

    if(mlevel < umbralInfMic){
      mostrarFiguras = false;
      console.log('mostrarFiguras: '+mostrarFiguras);
    }

  }

  push();

  tint(255);
  image(figuras[28], posXfigs, posYfigs, anchoFigs, altoFigs);

  pop();


  
}
