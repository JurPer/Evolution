

var creatures = [];
var food = [];
var poison = [];

var nutrition = [0.1, -1];

//for addition info
var debug;


function setup() {

	var canvas = createCanvas(800, 600);
	canvas.parent("canvascontainer");
	debug = select("#debug");
	//frameRate(20);

	//create 10 creatures
	creatures.length = 10;
	for(var i = 0; i < creatures.length; i++) {
		creatures[i] = new Creature(width / 2, height / 2);
	}

	//create food
	for(var i = 0; i < 10; i++) {
		food.push(createVector(random(width), random(height)));
	}
	//create food
	for(var i = 0; i < 5; i++) {
		poison.push(createVector(random(width), random(height)));
	}
}

//add new vehicles by dragging mouse
function mouseDragged(){
	creatures.push(new Creature(mouseX, mouseY));
}

function draw() {
	background(0);

	//10% chance to spawn new food
	if (random(1) < 0.1) {
		food.push(createVector(random(width), random(height)));
	}

	//1% chance to spawn new poison
	if (random(1) < 0.01) {
		poison.push(createVector(random(width), random(height)));
	}

	//iterate over all creature and call their functions
	for(var i = creatures.length - 1; i >= 0; i--) {
		var c = creatures[i];

		//Eat the food (index 0)
		c.eat(food, 0);
		//Eat the poison (index 1)
		c.eat(poison, 1);
		//Check boundaries
		c.boundaries();

		//Update and draw
		c.update();
		c.show();

		//remove dead creatures
		if (c.isDead()) {
			creatures.splice(i, 1);
		} else {
			//every creature has a chance of cloning itself
			var child = c.birth();
			if (child != null) {
				creatures.push(child);
			}
		}
	}	

	//draw food
	fill(0, 255, 0);
	noStroke();
	for(var i = 0; i < food.length; i++) {
		ellipse(food[i].x, food[i].y, 7);
	}

		//draw food
	fill(255, 0, 0);
	noStroke();
	for(var i = 0; i < poison.length; i++) {
		ellipse(poison[i].x, poison[i].y, 7);
	}
}