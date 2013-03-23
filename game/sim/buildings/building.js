define("game/sim/buildings/building.js",
	[],
// content
function () {
	return function(x, y, name, cfg){

		// Load configurtion details from room cfg
		this.x = x;
		this.y = y;
		this.name = name;
		for(var opt in cfg) this[opt] = cfg[opt];


		this.tick = function(){console.log("tock");}

	}
});