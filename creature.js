

class Creature {
	constructor(x, y, dna) {
		//physics
		this.position = createVector(x, y);
		this.velocity = p5.Vector.random2D();
		this.acceleration = createVector();
		this.r = 7;
		this.maxforce = 0.1;
		this.maxspeed = 3;
		this.velocity.setMag(this.maxspeed);

		this.health = 1;

		//did it receive DNA to copy
		if (dna instanceof Array) {
			this.dna = [];
			//copy all dna info
			for (var i = 0; i < dna.length; i++) {
				//10% chance of mutation
				if (random(1) < 0.1) {
					if (i < 2) {
						//Adjust steering force weights
						this.dna[i] = dna[i] + random(-0.2, 0.2);

					} else {
						//adjust perception radius
						this.dna[i] = dna[i] + random(-10, 10);
					}
					//copy dna
				} else {
					this.dna[i] = dna[i];
				}
			}
		} else {
			var maxf = 3;
			//DNA
			//0: Attraction/Repulsion to food
			//1: Attraction/Repulsion to poison
			//2: Radius to sense food
			//3: Radius to sense poison
			this.dna = [random(-maxf, maxf), random(-maxf, maxf),
			random(5, 100), random(5, 100)];
		}
	}

	update() {
		//update velocity
		this.velocity.add(this.acceleration);
		//limit speed
		this.velocity.limit(this.maxspeed);
		this.position.add(this.velocity);
		//reset acceleration to 0 each cycle
		this.acceleration.mult(0);

		//slowly die
		this.health -= 0.002;
	}

	//returns true if health is less than zero
	isDead() {
		return (this.health <= 0);
	}

	//small chance of returning a new child vehicle
	birth() {
		var r = random(1);
		if (r < 0.001) {
			//same location, same DNA
			return new Creature(this.position.x, this.position.y, this.dna);
		}
	}

	//check against array of food or poison
	//index = 0 for food, index = 1 for poison
	eat(list, index) {

		//find closest
		var closest = null;
		var closestD = Infinity;

		for (var i = list.length - 1; i >= 0; i--) {
			//calculate distance
			var d = p5.Vector.dist(list[i], this.position);

			//if it's within perception radius and closer than previous
			if (d < this.dna[2 + index] && d < closestD) {
				closestD = d;
				//save element
				closest = list[i];

				//if we're within 5 pixels, eat it
				if (d < 5) {
					list.splice(i, 1);
					//add or subtract from health based on food/poison
					this.health += nutrition[index];
				};
			}
		}

		if (closest) {
			//seek that closest
			var seek = this.seek(closest, index);
			//weight according to DNA
			seek.mult(this.dna[index]);
			//limit the force
			seek.limit(this.maxforce);
			this.applyForce(seek);
		};
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	// A method that calculates a steering force towards a target
	// STEER = DESIRED MINUS VELOCITY
	seek(target) {

		// A vector pointing from the location to the target
		var desired = p5.Vector.sub(target, this.position);
		//var d = desired.mag();

		// Scale to maximum speed
		desired.setMag(this.maxspeed);

		// Steering = Desired minus velocity
		var steer = p5.Vector.sub(desired, this.velocity);

		// Not limiting here
		//steer.limit(this.maxforce);

		//this.applyForce(steer);
		return steer;
	}

	show() {

		//Color based on health
		var green = color(0, 255, 0);
		var red = color(255, 0, 0);
		var col = lerpColor(red, green, this.health);

		var theta = this.velocity.heading() + PI / 2;
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);

		//More Info
		if (debug.checked) {
			noFill();

			//perception circle and line for food
			stroke(0, 255, 0, 100);
			ellipse(0, 0, this.dna[2] * 2);
			line(0, 0, 0, -this.dna[0] * 25);

			//perception circle and line for poison
			stroke(255, 0, 0, 100);
			ellipse(0, 0, this.dna[3] * 2);
			line(0, 0, 0, -this.dna[1] * 25);
		};

		//Draw the creature
		fill(col);
		stroke(col);
		beginShape();
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r * 2);
		vertex(this.r, this.r * 2);
		endShape(CLOSE);
		pop();
	}

	//a force to keep creatures on screen
	boundaries() {
		var d = 10;
		var desired = null;
		if (this.position.x < d) {
			desired = createVector(this.maxspeed, this.velocity.y);
		} else if (this.position.x > width - d) {
			desired = createVector(-this.maxspeed, this.velocity.y);
		}

		if (this.position.y < d) {
			desired = createVector(this.velocity.x, this.maxspeed);
		} else if (this.position.y > height - d) {
			desired = createVector(this.velocity.x, -this.maxspeed);
		};

		if (desired !== null) {
			desired.setMag(this.maxspeed);
			var steer = p5.Vector.sub(desired, this.velocity);
			steer.limit(this.maxforce);
			this.applyForce(steer);
		};
	}
}