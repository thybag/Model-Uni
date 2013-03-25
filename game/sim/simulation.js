 define("game/sim/simulation.js",
 	[
	 	"game/sim/buildings/building.config.js",
	 	"game/sim/buildings/building.js",
	 	"game/sim/people/student.js"
 	],
// content
function (building_config) {
	return new function(){


		this.courses = [
			{"name":"math", "lectures":["james","tim"]  }, 
			{"name":"english", "lectures":["zim"]  },
			{"name":"Computer Science", "lectures":["Bob"]  }
		];

		this.structures = [];
		this.entities = { "students":[], "staff":[] };
		this.data = {
			"student_population": 0,
			"res_capacity": 0,
			"acc_capacity": 0,
			"tot_capacity": 0,
			// unix timestamp in ms ( *1000 to get real timestamp)
			"time" : (new Date()).getTime()
		}

		this.buildings_config = building_config;
		this.proto_building = require("game/sim/buildings/building.js");
		this.proto_student = require("game/sim/people/student.js");

		// prototypes all have references to "simulation"
		this.proto_building.prototype.sim = this.proto_student.prototype.sim = this;

		this.tick = function(){

			this.data.time += 1000;

			for(var e=0;e<this.structures.length;e++)
				if(this.structures[e] != null)this.structures[e].tick();

			// Tick simulation for all entities
			for(var i=0;i<this.entities.students.length;i++)
				if(this.entities.students[i] != null)this.entities.students[i].tick();

			for(var i=0;i<this.entities.staff.length;i++)
				this.entities.staff[i].tick();
		}

		this.createStudent = function(x, y){
			student = new this.proto_student();
			student._init(1, 1);
			this.entities.students.push(student);
			this.data.student_population++;
		}

		this.getGameDate = function(){
			var date = {};

			date._date = new Date(this.data.time);
			console.log(date._date.getFullYear());
			date.year = date._date.getFullYear();
			data.month_no = date._date.getMonth();
		    date.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][data.month_no];
		    date.day = date._date.getDate();
		    date.hour = date._date.getHours();
		    date.min = date._date.getMinutes();
		    date.sec = date._date.getSeconds();
			//
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
					if(s !== null && s.type == type && s.capacity > s.occupancy) results.push(s);
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
			tmp.entities = this.entities;
			tmp.structures = this.structures;
			tmp.data = this.data;

			return tmp;

		}
		this.load = function(data){

			// repop "data"
			this.data = data.data;
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
		}
	}
});