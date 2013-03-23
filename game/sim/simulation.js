 define("game/sim/simulation.js",
 	["game/sim/buildings/building.config.js",
 	"game/sim/buildings/building.js"],
// content
function (building_config) {
	return new function(){

		this.entities = {"buildings":[], "students":[], "staff":[]};



		this.addBuilding = function(x, y, types){
			var cfg = building_config[type];

			// is there space?

			// can we afford?

			this.entities.buildings.push(new require("game/sim/buidlings/building.js"));

		}

	}
});