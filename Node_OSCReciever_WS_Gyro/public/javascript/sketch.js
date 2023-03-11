

// Create connection to Node.JS Server
const socket = io();

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;


function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
 
  createEasyCam();

 

  // turn off the createGraphics layers stroke
  
}

  function draw() {
    background(250);
    let radius = width * 1.5;
  
    //drag to move the world.
    orbitControl();
   
  
    normalMaterial();
    translate(0, 0, -600);
    rotateZ(pitch);
  rotateX(roll);
  rotateY(yaw);
    for (let roll = 0; roll <= 12; roll++) {
      for (let pitch = 0; pitch <= 12; pitch++) {
        for (let yaw = 0; yaw <= 12; yaw++) {


        push();
        
        let a = (pitch / 12) * PI;
        let b = (roll / 12) * PI;
        translate(
          sin(2 * a) * radius * sin(b),
          (cos(b) * radius) / 2,
          cos(2 * a) * radius * sin(b)
        );
        if (pitch % 2 === 0) {
          cone(30, 30);
        } else {
          box(30, 30, 30);
        }
        pop();
      }
    }
  }


//process the incoming OSC message and use them for our sketch
function unpackOSC(message){

  /*-------------

  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  // if(message.address == "/gyrosc/gyro"){
  //   roll = message.args[0]; 
  //   pitch = message.args[1];
  //   yaw = message.args[2];
  // }

  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/gyrosc/rrate"){
    roll += map(message.args[0],-3,3,-0.1,0.1);
    pitch += map(message.args[1],-3,3,-0.1,0.1);
    yaw += map(message.args[2],-3,3,-0.1,0.1);
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);
}
  )}