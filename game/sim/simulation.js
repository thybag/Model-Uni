 define("game/sim/simulation.js",
 	[
	 	"game/sim/buildings/building.config.js",
	 	"game/sim/buildings/building.js",
	 	"game/sim/people/student.js",
	 	"game/sim/cash.js"
 	],
// content
function (building_config) {
	return new function(){
		// vars
		this.buildings_config = building_config;
		this.proto_building = require("game/sim/buildings/building.js");
		this.proto_student = require("game/sim/people/student.js");
		// prototypes all have references to "simulation"
		this.proto_building.prototype.sim = this.proto_student.prototype.sim = this;

		//cash
		this.cash = require("game/sim/cash.js");

		// internals 
		this.counter = 0;
		// Time between "World Actions"
		this.action_tick = -1;//100 = standard

		// Courses
		this.courses = [
			{"id":0, "name":"math", "lectures":["james","tim"]  }, 
			{"id":1,"name":"english", "lectures":["zim"]  },
			{"id":2,"name":"Computer Science", "lectures":["Bob"]  }
		];

		// Structures
		this.structures = [];
		// Entities
		this.entities = { "students":[], "staff":[] };
		// Data
		this.data = {
			"university_name" : "My first uni.",
			"student_population": 0,
			"staff_population": 0,
			"res_capacity": 0,
			"acc_capacity": 0,
			"tot_capacity": 0,
			// unix timestamp in ms ( *1000 to get real timestamp)
			"time" : 1379660400, // 19 sept 2013
			"next_year_time": 1379667600, // 20 sept 2013 (first academic year)
			"is_night": true
		}	


		this.is_night = function(){
			return (this.data.is_night===true);
		}
		

		this.tick = function(){
			// Do want want to create a new student


			// sync clock
			if(this.action_tick != -1 && this.counter > (this.action_tick*4)){

				// new year at start of term, induct freashers
				if(this.data.time == this.data.next_year_time) this._newYear();

				this.data.time += 1800; this.counter=0;

			}this.counter++;
			
			// tick structures
			for(var e=0;e<this.structures.length;e++)
				if(this.structures[e] != null)this.structures[e].tick();

			// Tick simulation for all entities
			for(var i=0;i<this.entities.students.length;i++)
				if(this.entities.students[i] != null)this.entities.students[i].tick();

			for(var i=0;i<this.entities.staff.length;i++)
				if(this.entities.staff[i] != null)this.entities.staff[i].tick();
		}


		this._newYear = function(){
			console.log("INDUCT!");
			// work out 1 year time..
			this.data.next_year_time = this.data.next_year_time+31536;
			// roll over current students
			for(var i=0;i<this.entities.students;i++){
				if(this.entities.students[i] !== null) this.entities.students[i].enterNextYear();
			}

			// Induction math
			// how many people can come? (course spaces etc)
			// for now just use "homes"
			places = this.data.tot_capacity - this.data.student_population;	

			// induct!
			for(var i=0;i<places;i++){
				setTimeout(function(){
					game.sim.createStudent();
				},(i*80));
			}

		}


		this.createStudent = function(x, y){
			student = new this.proto_student();
			student._init(1, 0);
			this.entities.students.push(student);
			this.data.student_population++;
		}

		this.getGameDate = function(){
			var date = {};
			date._date = new Date(parseInt(this.data.time+'000'));
			date.year = date._date.getFullYear();
			date.month_no = date._date.getMonth();
		    date.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.month_no];
		    date.day = date._date.getDate();
		    date.hour = date._date.getHours();

		    // 10pm - 8am = night
		    this.data.is_night = (date.hour >= 22 || date.hour <= 7);
		    game.renderer.nightMode(this.data.is_night);

		    // Add leading 0s
		    if(date.day < 10) date.day = '0'+date.day;
		    if(date.hour < 10) date.hour = '0'+date.hour;
		    date.min = '00';

			return date;

		}


		this.getBuildingDetails = function(type){
			return building_config[type]
		}

		this.createBuilding = function(x, y, type){
			var cfg = building_config[type];
			
			// is there space?

			// can we afford?
			building = new this.proto_building(x, y, type, cfg);

			//update data
			if(building.type == 'accommodation'){
				this.data.tot_capacity += building.capacity;
				this.data.res_capacity += building.capacity;
			}

			// store id & add to entities
			building.id = this.structures.length;
			this.structures.push(building);

			return building;
		}
		// get building by its "ID"
		this.getBuildingById = function(id){
			return this.structures[id];
		}
		this.removeBuilding = function(building){
			// Updata capacitys
			if(building.type == 'accommodation'){
				this.data.tot_capacity -= building.capacity;
				this.data.res_capacity -= building.capacity;
			}
			// Remove from entities
			this.structures[building.id] = null;
		}

		this.findStructureByType = function(type, is_free){

			var results = [], s = null;
			for(var i=0;i<this.structures.length;i++){
				s = this.structures[i];

				if(typeof is_free == 'undefined'){
					if(s !== null && s.type == type) results.push(s);
				}else{
					if(s !== null && s.type == type && s.capacity > s.residence) results.push(s);
				}
				
			}
			return results;
		}
		this.findRandomStructureByType = function(type){

			results = this.findStructureByType(type);
			if(results.length==0) return false;
			return results[Math.floor((Math.random()*results.length))];

		}

		// Format data for save
		this.forSave = function(){
			var tmp = {};

			tmp.entities = {"students": []};
			tmp.structures = this.structures;
			tmp.total_cash = this.cash.total;

			for(var s in this.entities.students){
				student = this.entities.students[s];
				if(student != null) student = student._save();
				tmp.entities.students.push(student);
			}
		
			tmp.data = this.data;

			return tmp;

		}
		this.load = function(data){

			// repop "data"
			this.data = data.data;
			this.cash.total = data.total_cash;

			// repop structures
			for(itm in data.structures){

				val = null;
				if( data.structures[itm] != null){
					// Rebuild entity object
					tmp =  data.structures[itm];
					val = new this.proto_building(tmp.x, tmp.y, tmp.name, tmp);
				}
				this.structures.push(val);
			}

			//reload students

			for(itm in data.entities.students){
				student = student_data = data.entities.students[itm];

				if( student != null){
					student = new this.proto_student();
					student._load(student_data);
				}
				this.entities.students.push(student);
			}
			

		}
	}
});