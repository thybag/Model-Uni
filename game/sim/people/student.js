define("game/sim/people/student.js",
	["game/sim/people/person.js"],
// content
function (person) {
	var Student = function(){

		// Attributes
		this.fitness = 50;
		this.tiredness = 0;
		this.hunger = 0;
		this.drunkness = 0;
		this.smartness = 0;
		this.bordem = 0;

		this.happiness = 0;

		


		// Internals
		this.sprite_type = 'students';
		this.counter = 0;

		this.movement_queue = [];


		this.init = function(x,y){

			// possible "sprite types"
			this.sprite_instance = '1';
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



	};
	Student.prototype = person;
	return Student;
});