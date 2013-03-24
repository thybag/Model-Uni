 define("game/sim/simulation.js",
 	[
	 	"game/sim/buildings/building.config.js",
	 	"game/sim/buildings/building.js",
	 	"game/sim/people/student.js"
 	],
// content
function (building_config) {
	return new function(){

		this.structures = [];
		this.entities = { "students":[], "staff":[] };



		this.buildings_config = building_config;
		this.proto_building = require("game/sim/buildings/building.js");
		this.proto_student = require("game/sim/people/student.js");

		this.tick = function(){
			for(var e=0;e<this.structures.length;e++)
				this.structures.tick();

			// Tick simulation for all entities
			for(var e=0;e<this.entities.length;e++)
				for(var i=0;i<this.entities[e].length;i++)
					this.entities[e][i].tick();
		}


		this.createStudent = function(x, y){
			student = new this.proto_student();
			student.init();
			this.entities.students.push(student);
		}



		this.getBuildingDetails = function(type){
			return building_config[type]
		}
		this.createBuilding = function(x, y, type){
			var cfg = building_config[type];
			
			// is there space?

			// can we afford?
			building = new this.proto_building(x, y, type, cfg);
			// store id & add to entities
			building.id = this.structures.length;
			this.structures.push(building);

			return building;
		}
		
		this.load = function(entity_data, structures){

			console.log(structures);
			for(itm in structures){

				val = null;
				if(structures[itm] != null){
					// Rebuild entity object
					tmp = structures[itm];
					val = new this.proto_building(tmp.x, tmp.y, tmp.name, tmp);

				}
				this.structures.push(val);
			}
		}
	}
});