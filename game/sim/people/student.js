define("game/sim/people/student.js",
	["game/sim/people/person.js"],
// content
function (person) {
	var Student = function(){

		// Set person as parent
		this.sprite_type = 'students';
		this.counter = 0;

		this.init = function(x,y){

			// possible "sprite types"
			this.sprite_instance = '1';
		}

		this.tick = function(){
			this.counter++;

			// move every 100 ticks
			if(this.counter > 100){
				this.y++;
				this.counter = 0;
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