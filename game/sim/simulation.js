 define("game/sim/simulation.js",
 	["game/sim/buildings/building.config.js",
 	"game/sim/buildings/building.js"],
// content
function (building_config) {
	return new function(){

		this.entities = {"buildings":[], "students":[], "staff":[]};


		this.blank_building = require("game/sim/buildings/building.js");

		this.tick = function(){
			// Tick simulation for all entities
			for(var e;e<this.entities.length;e++)
				for(var i;i<this.entities[e].length;i++)
					this.entities[e][i].tick();
		}


		this.getBuildingDetails = function(type){
			return building_config[type]
		}
		this.createBuilding = function(x, y, type){
			var cfg = building_config[type];
			
			// is there space?

			// can we afford?
			building = new this.blank_building(x, y, cfg);

			this.entities.buildings.push(building);

			return building;
		}
		this.getBuildingAt = function(x, y){}

	}
});