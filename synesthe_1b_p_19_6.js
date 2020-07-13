const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

var figuras = [];

let pitch;  // el detector
let frecuencia;
let mlevel, micNivelRegistrado;     // ;p detectado
let mic;    // el mic
let midiNote;
let indiceFigura;
let transparencia;
let factorDimOpac;
let mostrarFiguras;
let unbralSupMic, umbralInfMic;

let currentNoteName = "";


// let r;
let posXfigs, posYfigs, anchoFigs, altoFigs, factorFigs;
// var canRender = false;


// let promedio = [];
// let cant = 5;

let contextoDeAudio;

let arrancarPitching;

const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];



function preload() {
  for (let i = 0; i < 29; i++ ) {
    figuras[i] = loadImage( "./data/" + i + ".png" );
  }
}

function setup() {

  console.log('setup. creating canvas:');
  // promedio = [];
  // cantidad = 5;


  cnv = createCanvas(windowWidth, windowHeight);
  // cnv.mousePressed(initAudio);  
  cnv.mousePressed(userStartAudio);

  frameRate(25); // Attempt to refresh at starting FPS


  contextoDeAudio = getAudioContext();

    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();

    arrancarPitching = false

  // muestra una indicacion de lo que tiene que hacer el usuario
  textSize(14);
  textLeading(20); // Set leading to 10
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

  unbralSupMic = 0.012;
  umbralInfMic = 0.0035;
  indiceFigura = 0;
  transparencia = 0;
  factorDimOpac = 1.07;

  console.log('end setup...');
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, contextoDeAudio, mic.stream, modelLoaded);
}

function modelLoaded() {
  // select("#status").html("Model Loaded");
  console.log('modelLoaded!');

  // pichi2();
}

function pichi2() {
  pitch.getPitch(function(err, frequency) {
    if (frequency && !isNaN(frequency)) {
        console.log('frequency: '+ frequency);

      frecuencia = frequency;
      console.log('frecuencia: '+ frecuencia);

      midiNote = freqToMidi(frecuencia);
      console.log('midiNote: '+ midiNote);
      
      // const midiNum = freqToMidi(frequency);
      currentNoteName = scale[midiNote % 12];

      indiceFigura = midiNote - 48;
      console.log('indiceFigura: '+indiceFigura);
  
    }
      pichi2();
  });
}

  // if(promedio.length >= cant) promedio.shift();
  // promedio.forEach( 
  //   f => {
  //     fd += f;
  //   } 
  //  )
  
  // fd /= cant;  
  // console.log("promedio: "+fd);
// }

// amortiguador
// function ease(prev, current, factor) {
//   return current*factor + prev * (1 - factor); 
// }

// dispara alpha
// function trigger(mic){
//   if(mic > thr) alpha = 255;
// }
// let velocidad = 0.1;

function draw() {

  // console.log("entro al draw!");

  if (contextoDeAudio.state !== 'running') {
    console.log("entré al audiocontext!");
    background(220);
    textSize(16);
    text(' clickear/tocar aquí para habilitar el mic y empezar \n \n click/tap here and enable mic to begin', width*0.1, height*0.1 , width*0.8,  height*0.8);
    // text('click/tap here and enable mic to begin', 40, 60, width - 20);
    arrancarPitching = true;
    return;
  } else if(arrancarPitching){
    // mic.start();
    pitch = ml5.pitchDetection(model_url, contextoDeAudio, mic.stream, modelLoaded);  
    // mic.start(startPitch);
    console.log("startPitching!");
    arrancarPitching = false;
  }

  background(0);
  // constrain(alpha - velocidad, 0, 255);
  
    // mlevel = 1; 
  mlevel = mic.getLevel();
  console.log('mic level: '+ mlevel);

  if(mlevel > unbralSupMic && !mostrarFiguras){

    console.log('mic level: '+ mlevel);

    // <<<<<<<<<<<<<<<<<<
    // esto está mal... pichi se llama a si misma
    // pichi2();

    // midiNote = int(69+12*(log((fd)/440)));
    // midiNote = freqToMidi(fd); 
    
    // console.log('midiNote: '+midiNote);

    transparencia = 255;
    
  // transparencia = 255;
  // transparencia = map(mlevel, 0, micNivelRegistrado, 0, 255);

    mostrarFiguras = true;
    console.log('mostrarFiguras: '+mostrarFiguras);
   
      // micNivelRegistrado = mlevel;
  
  }

  if(mostrarFiguras){
    console.log('frecuencia: '+ frecuencia);
    console.log('midiNote: '+ midiNote);

    console.log('transparencia: '+transparencia);


    fill(255);
    text('nota: ' + currentNoteName, 40, 30, width - 40);

    // if(!isNaN(mlevel)){
    //   // transparencia = map(mlevel, 0, micNivelRegistrado, 0, 255);
    //   transparencia = map(mlevel, 0, 1.0, 0, 255);
    //   // console.log('transparencia: '+transparencia);
    // }

    push();

    tint(255, transparencia);
    if( indiceFigura >= 0 && indiceFigura < figuras.length-1 ){

      image(figuras[indiceFigura], posXfigs, posYfigs, anchoFigs, altoFigs);

      transparencia /= factorDimOpac;
    }
  
    pop();


  if(mlevel < umbralInfMic){
    mostrarFiguras = false;
    console.log('mostrarFiguras: '+mostrarFiguras);
    transparencia = 0
    frecuencia = 0;
    indiceFigura = -1;
    currentNoteName = "";
  }

}
 push();
  tint(255);
  image(figuras[28], posXfigs, posYfigs, anchoFigs, altoFigs);
pop();

  
}
