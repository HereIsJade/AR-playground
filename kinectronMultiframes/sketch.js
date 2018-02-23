var myCanvas = null;
var pg;

var frames = [];
// Declare kinectron
var kinectron = null;
// Mapping Kinect data to projecion
var xscl, yscl;
var xshift, yshift;
var scl = true;
// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 1000;


function setup() {
  myCanvas = createCanvas(800, 800);
  pg = createGraphics(800, 800);

  // Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.247.165"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect with application over peer
  kinectron.makeConnection();
  // Set frames wanted from Kinectron
	frames = ["color", "body"];

  // Set callbacks
  kinectron.startRGB();
  kinectron.setRGBCallback(drawFeed);
  kinectron.setBodiesCallback(bodyCallback);
  // kinectron.startTrackedBodies(bodyTracked);

  xscl = (width);
  yscl = -(width/1.1);
  xshift = width/2;
  yshift = height / 3;

}

function keyPressed() {
	if (keyCode === ENTER) {
		// Start multiframe with a dedicated multiframe callback
	 	kinectron.startMultiFrame(frames, multiFrameCallback);
	}

	if (keyCode === UP_ARROW) {
		// Start multiframe using individual frame callbacks
	 	kinectron.startMultiFrame(frames);
	}
 }


function draw() {
  pg.background(0,0);
  pg.noFill();
  pg.stroke(253,255,0);
  var joints = bm.getJoints(kinectron.HANDLEFT);
  for (var j = 0; j < joints.length; j++) {
    // Get the position
    var joint = joints[j];
    var pos = getPos(joint.pos);
    console.log(pos);
    pg.ellipse(pos.x, pos.y, 40, 40);
  }



  //Draw the offscreen buffer to the screen with image()
  // image(pg, 150, 75);
  image(pg, 0, 0);




}

function bodyCallback(body) {
	//find tracked bodies
	for (var i = 0; i < body.length; i++) {
		if (body[i].tracked === true) {
			bodyTracked(body[i]);
		}
	}
}

function multiFrameCallback(data) {
	console.log(data);
	debugger;
}

function bodyTracked(body) {
  var id = body.trackingId;
  // When there is a new body
  if (!bm.contains(id)) bm.add(body);
  else bm.update(body);
}

function getPos(joint) {
  // return createVector((joint.x ) , (joint.y) );

  return createVector((joint.x * xscl) + xshift, (joint.y * yscl) + yshift);
}

function drawFeed(img) {
  // Draws feed using p5 load and display image functions
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0,800,500);
  });
}
