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

		//  how happy are they (Sad AI may eat more junkfood?)
		this.happiness = 40;

		// Base attributes (effect behavious?)
		this._extraverted = 50; // intro/extro interest in partying/getting drunk
		this._studious = 5; // interest in education
		this._resilience = 5; // resitance to tireness/ drinking to much
		this._volatile = 5; // will they start fights / break stuff / mood swings

		// data
		this.course = '<id>';
		this.home = '<id>';
		this.name = "Jimmy";

		// Internals
		this.building_going_to = null;
		this.building_in = null;
		this.movement_queue = [];
		this.exploring = false;
		
		this.sprite_type = 'students';
		this.counter = 0;
		this.action_counter = 0;

		// debug - listen to a students though proccess
		this.thunk_loudly = false;
		this.thunk = function(msg){if(this.thunk_loudly) console.log('['+this.name+'] ' +msg);}

		this.is_action_tick = function(){
			t = (this.counter > 100);
			if(t)this.counter=0;

			return t;
		}
		
		this.in_building = function(){
			return (this.building_in !== null);
		}


		this.next_tile = function(){
			if(this.movement_queue.length !==0)return this.movement_queue[0];
			return false;
		}
		this.next_direction = function(){
			if(next = this.next_tile()){
				if(next.x > this.x) return 'left';
				if(next.x < this.x) return 'right';
				if(next.y < this.y) return 'up';
				if(next.y > this.y) return 'down';
			}
			return false;
		}


		this.init = function(x,y){

			// possible "sprite types" (1-4 currently)
			this.sprite_instance = this.rand(4)-1;

			// assign room & course
			this.course = this.sim.courses[this.rand(this.sim.courses.length)-1];

			// assign home
			possible_homes = this.sim.findStructureByType("accommodation", true);
			this.home = possible_homes[this.rand(possible_homes.length)-1]
			this.home.residence++;

			//offset slighly
			this.x_offset += this.rand(18)-9; // +/- 9
			this.y_offset += this.rand(22)-11;

			this.thunk("I'm new. My room is <"+ this.home.id+"> and i study" + this.course.name);

			//first action
			this._goHome();
		}

		this.action_tick = function(){
			this.action_counter++;

			// if exploring, use explore logic
			if(this.exploring) return this.action_explore();

			// Apply att changes
			if(this.in_building()){

				this.thunk("I'm inside a "+ this.building_in.type +" building.");
				// Apply buildings modifiers
				for(m in this.building_in.modifiers){
					this[m] += this.building_in.modifiers[m];
				}

				// After been in buidling long enough, leave
				if(this.action_counter > 6){
					this._exitBuilding();
					this.action_counter = 0;
					this.counter = 0;
				}
			}else{
				// Walking modifiers
				this.hunger++;
				this.tiredness++;
				this.fitness++;
				// Are we going somewhere?
				if(this.movement_queue.length != 0){

					if(this.movement_queue.length==1){
						// empty queue
						this.movement_queue.shift();
						this._enterBuilding();
						this.action_counter = 0;

					}else{
						this.thunk("Walking to next tile...");
						move_to = this.movement_queue.shift();

						this.x = move_to.x;
						this.y = move_to.y;
					}

				}else{
					// What do i want to do?
						this.decideNextAction();
				}
			}
		}
		// Explore action set (students can explore the campus for fun)
		this.action_explore = function(){
			this.hunger++;
			this.tiredness++;
			this.fitness++;
			this.bordem--;

			// to tired/hungry to continue? turn back
			if(this.tiredness > 80 || this.hunger > 80 ){

				this.thunk("I'm tired and hungry and still not there, guess I'll have to turn back.");
				this.confidence -= 5;
				this.happiness -= 10;
				this._goHome();
				return;
			}
			// Keep going
			if(this.movement_queue.length != 0){
				this.thunk("Exploring next tile...");
				move_to = this.movement_queue.shift();
				this.x = move_to.x;
				this.y = move_to.y;
			}else{

				this.thunk("I found it! awesome.");
				// Found what they were looking for!
				this.bordem -= 10;
				this.confidence += 5;
				this.happiness += 10;
				//
				this.exploring = false;
				this.decideNextAction();
			}
		}

		this.tick = function(){
			this.counter++;

			if(this.is_action_tick()) this.action_tick();

		}

		this.decideNextAction = function(){
			this.thunk("That is done. Now i will decided my next action.");
			//1-10 used to randomly change outcomes without needing to cal to many randoms
			var rdm = this.rand(10);

			if(this.tiredness < 50 && this.hunger < 50){
				if(this.bordem < 60){
					action = this._findEducation();
					if(action===false) this.complain("no_learn");
				}else{

					if(rdm < 8){
						action = this._findEntertainment();
					}else{
						action = this._explore();
					}

					if(action===false) this.complain("no_fun");
				}
			}
			else
			{
				// Eat & sleep - almost like a real person!
				if(this.tiredness > this.hunger){
					this._goHome();
				}else{
					action = this._findFood();
					if(action===false) this.complain("no_food");
				}
			}
	
			// critial
			// am i v tied / v hungry?

			// do i have lectures?

			// what do i want to do most? (fun/eat/drink/party)

			this.thunk("I was unable to do what i wanted. Guess i'll just go back to my room.");
			this.happiness -= 5; // Not being able to do what they want makes AI's sad
			// Nothing todo? back to bed
			this._goHome();
		}

		this._enterBuilding = function(){
			this.thunk("Entering <" +  this.building_going_to.type +"> building.");
			this.building_in = this.building_going_to;
			this.building_going_to = null;
			this.building_in.occupancy++;

			this.visable = false;
						
		}
		this._exitBuilding = function(){
			this.thunk("Exiting <" +  this.building_in.type +"> building.");

			this.building_in.occupancy--;
			this.building_in = null;

			this.visable = true;
			
		}

		// common actions

		this.planRouteTo = function(building){
			this.thunk("*sets off*");
			this.movement_queue = game.map.findPath({x: this.x, y: this.y}, {x:building.x , y:building.y});
			this.building_going_to = building;
		}



		this._goHome = function(){
			this.thunk("I will go to my room at <"+this.home.id+">");
			this.exploring = false;
			this.planRouteTo(this.home);
		}

		this._findEducation = function(){
			this.thunk("I want to lean somthing <education>");

			result = this.sim.findRandomStructureByType("education");
			if(result==false)return false;
			this.planRouteTo(result);
		}
		this._findFood = function(){
			this.thunk("I want to get some food <food>");
			result = this.sim.findRandomStructureByType("food");
			if(result==false)return false;
			this.planRouteTo(result);
		}
		this._findEntertainment = function(){
			this.thunk("I want to have fun <fun>");
			result = this.sim.findRandomStructureByType("fun");
			if(result==false)return false;
			this.planRouteTo(result);
		}

		this._findFitness= function(){
			this.thunk("I want to get fit <fitness>");
			result = this.sim.findRandomStructureByType("fun");
			if(result==false)return false;
			this.planRouteTo(result);
		}

		this._explore = function(){
			//var dist = 2+Math.round(this.confidence/6); // confident students will explore futher afield.
			this.exploring = true;
			var finding = this.randTile();
			this.thunk("I'm going to go and explore! I wonder whats at x:"+finding.x+' y:'+finding.y);

			this.planRouteTo(finding);
		}
		this._findParty = function(){
			
		}
		this._throwParty = function(){
			// need party map so other students can find?
		}

		this.randTile = function(){
			n_x = this.rand(50)-1;
			n_y = this.rand(50)-1;
			return {x: n_x, y: n_y};
		}

	}
	Student.prototype = person;
	return Student;
});