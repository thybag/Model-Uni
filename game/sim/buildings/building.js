define("game/sim/buildings/building.js",
	[],
// content
function () {
	return function(x, y, cfg){

		// Load configurtion details from room cfg
		this.x = x;
		this.y = y;
		for(var opt in cfg) this[opt] = cfg[opt];


		this.tick = function(){console.log("tock");}

	}
});