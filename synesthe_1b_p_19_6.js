const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

var figuras = [];

let pitch;  // el detector
let fd;
let mlevel, micNivelRegistrado;     // ;p detectado
let mic;    // el mic
let midiNote;
let indiceFigura;
let transparencia;
let mostrarFiguras;
let unbralSupMic, umbralInfMic;

// let r;
let posXfigs, posYfigs, anchoFigs, altoFigs, factorFigs;
var canRender = false;


let promedio = [];
let cant = 5;



function preload() {
  for (let i = 0; i < 29; i++ ) {
    figuras[i] = loadImage( "./data/" + i + ".png" );
  }
}

function setup() {

  console.log('setup. creating canvas:');
  promedio = [];
  cantidad = 5;


  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(initAudio);  
  // muestra una indicacion de lo que tiene que hacer el usuario
  textSize(14);
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

  transparencia = 0;
  mostrarFiguras = false;

  unbralSupMic = 0.015;
  umbralInfMic = 0.003;
  indiceFigura = 0;

  console.log('end setup...');

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
  pichi();
  canRender = true;
  cnv.mousePressed(() => console.log('puto el que lee'));
}


function pichi() {
  console.log('get pitch');
  pitch.getPitch(function(err, frequency) {
    if (frequency) {
      console.log("frequency: "+frequency);
      promedio.push(frequency);
      // fd = frequency;
    } else {
      // console.log('no pitch');
    }
    pichi();

  })


  if(promedio.length >= cant) promedio.shift();
  promedio.forEach( 
    f => {
      fd += f;
    } 
   )
  
  fd /= cant;  
  console.log("promedio: "+fd);
}


// amortiguador
function ease(prev, current, factor) {
  return current*factor + prev * (1 - factor); 
}

// dispara alpha
function trigger(mic){
  if(mic > thr) alpha = 255;
}

let velocidad = 0.1;


function draw() {

  if( !canRender ) return;
  background(0);
  
  constrain(alpha - velocidad, 0, 255);
  
  mlevel = 1; // mic.getLevel();
  // console.log('mic level: '+ mlevel);
  midiNote = int(69+12*(log((fd)/440)));

  transparencia = 255;

 indiceFigura = midiNote - 48;
 if( indiceFigura >= 0 && indiceFigura < figuras.length ){
      image(figuras[indiceFigura], posXfigs, posYfigs, anchoFigs, altoFigs);
  }


 push();
  tint(255);
  image(figuras[28], posXfigs, posYfigs, anchoFigs, altoFigs);
  pop();

  // borrar...return
  return;




  if(mlevel > unbralSupMic && !mostrarFiguras){
   
    micNivelRegistrado = mlevel;

    mostrarFiguras = true;
    console.log('mostrarFiguras: '+mostrarFiguras);

      midiNote = int(69+12*(log((fd)/440)));
      
      console.log('midiNote: '+midiNote);
      indiceFigura = midiNote - 48;
      console.log('indiceFigura: '+indiceFigura);

  }

  if(mostrarFiguras){

    fill(255);
    text('nota: ' + midiNote, 40, 30, width - 40);


    if(!isNaN(mlevel)){
      // transparencia = map(mlevel, 0, micNivelRegistrado, 0, 255);
      transparencia = map(mlevel, 0, 1.0, 0, 255);
      // console.log('transparencia: '+transparencia);
    }

    push();

    tint(255, transparencia);
    if( indiceFigura >= 0 && indiceFigura < figuras.length ){

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
