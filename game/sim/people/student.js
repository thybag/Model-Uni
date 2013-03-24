define("game/sim/people/student.js",
	["game/sim/people/person.js"],
// content
function (person) {
	var Student = function(){

		// Attributes
		this.fitness = 50; // Can student still manage a staircase?
		this.health = 50; // Is student ill / getting enough decent food / not hungover?
		this.tiredness = 0; // Have they pulled an all nighter
		this.hunger = 20; // Are they starving?
		this.drunkness = 0; // how sober are they?
		this.smartness = 10; // how smart are they?
		this.bordem = 50; // how board are they?

		//  how happy are they
		this.happiness = 90;

		// Base attributes (effect behavious)
		this._funloving = 5; // interest in partying/getting drunk
		this._studious = 5; // interest in education
		this._resilient = 5; // resitance to tireness/ drinking to much
		this._problematic = 5; // will they start fights / break stuff?

		// data
		this.course = '<id>';
		this.home = '<id>';


		// Internals
		this.sprite_type = 'students';
		this.counter = 0;
		this.movement_queue = [];

		this.in_building = false;


		this.init = function(x,y){

			// possible "sprite types" (1-4 currently)
			this.sprite_instance = Math.floor((Math.random()*4));
			console.log(this.sprite_instance);
		}

		this.tick = function(){
			this.counter++;

			
			if(this.movement_queue.length != 0){
				// move every 100 ticks
				if(this.counter > 100){
					console.log("move to next place");
					move_to = this.movement_queue.shift()

					this.x = move_to.x;
					this.y = move_to.y;
					//this.y++;
					this.counter = 0;
				}
			}else{
				// What do i want to do?
				console.log("decide action");
				this.movement_queue = game.map.findPath({x: this.x, y: this.y}, {x:10, y:5});
				console.log(this.movement_queue);
			}
			

			
			//move = 2;

			//this.inner_x += move;
			//this.inner_y += move/2;

			//if(this.paintEntities();)

			// w = 100
			// h = 50

			//console.log(this.inner_x);
		}

		this.decideNextAction = function(){

			// critial
			// am i v tied / v hungry?

			// do i have lectures?

			// what do i want to do most? (fun/eat/drink/party)


		}



	};
	Student.prototype = person;
	return Student;
});