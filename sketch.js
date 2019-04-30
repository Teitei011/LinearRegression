var width = 1440;
var height = 720;
var data_input;

var i;
var output1 = "";
var output2 = "";
var output3 = "";
var inicial1, inicial2;

// String contendo tudo o que foi escrito
var data_pre_processed = "";
var line = [];
// buffers
var x_buffer;
var y_buffer;

// Vetores para os dois casos
var x_y = [];
var x = [];
var y = [];

// Math Variables
var alpha = 0, beta;
var upper_alpha = 0, down_alpha = 0;

var x_sum = 0, x_mean;
var y_sum = 0, y_mean;

var dispersao_media = 0;
var incerteza_alpha = 0;
var incerteza_beta = 0;
var upper_incerteza_beta

let rUp, rDown, r;


function setup() {
  createCanvas(800, 600)
  textSize(40);
  fill(0)
  var titulo = text("Linear Regression" , width * 0.5, height / 10);

  data_input = createElement('textarea').size(500,400);
  // data_input = createInput("");
  data_input.position(width*0.05, height / 4)
  // data_input.input();
  textSize(20);
  button = createButton("Process");
  button.position(width*0.05, height * 0.95).size(500,50);
  button.mousePressed(main);

  inicial1 = createElement("h1",output1)
  inicial1.position(width * 0.70, 200)

  inicial2 = createElement("h1",output2)
  inicial2.position(width * 0.70, 300)

  inicial3 = createElement("h1",output3)
  inicial3.position(width* 0.70, 400)
}


function process(){
  data_pre_processed = data_input.value();
  data_pre_processed = data_pre_processed.replace(/(\r\n|\n|\r)/gm," ");
  x_y = [];
  x = [];
  y = [];

  x_y = float(data_pre_processed.split(" "));

  // Separando cada valor em seu vetor correto
  let contador = 0;

  // for (i = 0; i < x_y.length; i++) console.log(x_y[i]);

  for (i = 0; i < x_y.length; i++){
    if (contador == 0){
      x.push(x_y[i]);
      ++contador;
      }
    else{
      y.push(x_y[i]);
      contador = 0;
    }
  }
  data_input.value("");

  // console.log(x)

}

function inicializar_com_zero(){
  alpha = 0, beta = 0;
  upper_alpha = 0, down_alpha = 0;

  x_sum = 0, x_mean;
  y_sum = 0, y_mean;

  dispersao_media = 0;
  incerteza_alpha = 0;

  upper_incerteza_beta = 0;
  incerteza_beta = 0;
}

function main(){
  inicializar_com_zero();
  process();
  calculate_alpha();
  calculate_beta();
  dispersao();
  rSquare();

  put_in_the_screen();
}

function put_in_the_screen(){
  output1 = "m = " + alpha + " ± " + incerteza_alpha + "\n"
  output2= "n = " + beta + " ± " + incerteza_beta + "\n"
  output3 = "R² = " + r + "\n"

  inicial1.html(output1)
  inicial2.html(output2)
  inicial3.html(output3)
}


function calculate_alpha(){
 // First calculate the mean
  for (i = 0; i < x.length; i++) {
    x_sum += x[i];
}
  x_mean = x_sum / (x.length);
  // Calculating upper alpha part
  for (i = 0; i < x.length; i++){
    upper_alpha += (x[i] - x_mean)*y[i];
  }
  for (i = 0; i < x.length; i++){
    down_alpha +=(x[i]-x_mean)**2;
  }
  alpha = (upper_alpha / down_alpha);
}

function calculate_beta(){
  // Calculating y sum
  for (i = 0; i < y.length; i++){
    y_sum += y[i];
  }
  y_mean = y_sum  / y.length;

  beta = y_mean - alpha*x_mean;
}


function dispersao(){
  // Calculo da dispersao media
  for (i = 0; i < x.length; i++){
    dispersao_media += (alpha * x[i] + beta -y[i])**2;
  }
  dispersao_media = sqrt(dispersao_media / (x.length - 2));


  // Calculo de incerteza_alpha
  for (i = 0; i < x.length; i++){
    incerteza_alpha += (x[i] - x_mean)**2;
  }
  incerteza_alpha = dispersao_media / (sqrt(incerteza_alpha));

  // Calculo da incerteza Beta
  for (i = 0; i < x.length; i++){
    upper_incerteza_beta += (x[i]**2);
    incerteza_beta += (x[i] - x_mean)**2;
  }
  incerteza_beta = sqrt(upper_incerteza_beta / (x.length * incerteza_beta)) * dispersao_media;
}


function rSquare(){
  rUp = 0;
  rDown = 0;
  r = 0;

  for (i = 0; i < y.length; i++){
    rUp += (y[i] - y_mean)**2;
    rDown += (y[i] - beta)**2;
  }

  r = 1 - rUp / rDown;
}
