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
		this.confidence = 50; // confidence?

		//  how happy are they
		this.happiness = 40;

		// Base attributes (effect behavious?)
		this._extraverted = 50; // intro/extro interest in partying/getting drunk
		this._studious = 5; // interest in education
		this._resilience = 5; // resitance to tireness/ drinking to much
		this._volatile = 5; // will they start fights / break stuff / mood swings


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
			this.sprite_instance = this.rand(4)-1;

			// assign room & course
			this.course = this.sim.courses[this.rand(this.sim.courses.length)-1];

			possible_homes = this.sim.findStructureByType("accommodation");
			for(var i=0;i<possible_homes.length;i++){
				if(possible_homes[i].occupancy < possible_homes[i].capacity)break;
			}
			possible_homes[i].occupancy++;
			this.home = possible_homes[i];

			//first action
			this._goHome();
		}

		this.tick = function(){
			this.counter++;

			if(!this.in_building){

				if(this.movement_queue.length != 0){


					// move every 100 ticks
					if(this.counter > 100){

						if(this.movement_queue.length==1){
							// Next step is destintion, enter building
							move_to = this.movement_queue.shift();
							building = game.map.buildingAt(move_to.x, move_to.y);

							structure = this.sim.getBuildingById(building.id);

							this._enterBuilding(structure);
						}else{
							console.log("move to next place");
							move_to = this.movement_queue.shift();

							this.x = move_to.x;
							this.y = move_to.y;

						}
						//this.y++;
						this.counter = 0;
					}
				}else{
					// What do i want to do?
					console.log("decide action");

					this.decideNextAction();
				}


			}else{
				// leave building after stay of length X
				if(this.counter > 1000){
					this._exitBuilding();
					this.counter = 0;
				}


			}

		}

		this.decideNextAction = function(){

			// critial
			// am i v tied / v hungry?

			// do i have lectures?

			// what do i want to do most? (fun/eat/drink/party)

		}

		this._enterBuilding = function(building){

			this.in_building = true;
			this.visable = false;
			building.occupancy++;
						
		}
		this._exitBuilding = function(building){
			console.log("exit building?");
		}

		// common actions
		this._goHome = function(){
			this.movement_queue = game.map.findPath({x: this.x, y: this.y}, {x:this.home.x , y:this.home.y});
		}



	};
	Student.prototype = person;
	return Student;
});