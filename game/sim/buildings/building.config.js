/**
 * Tiles
 * Define all the differnt tiles in the game, as well as there relations to one another
 * Tiles also define how they respond to other near by tiles (used to connect roads, rivers, whatever else automatically)
 *
 * @package	model-uni
 */
 define("game/sim/buildings/building.config.js",[],
// content
function () {
	var buildings;
	return buildings = {

		// Normal tiles (generated)
		'smallhouse' : {
						"img": 'assets/buildings/student-flat.png', 
						"w" : 1,
						"h" : 1,
						"type": "accommodation",
						"capacity": 8,
						"running_costs": 250,
						"modifiers" : {"tiredness": -10, "hunger": 1}
		},
		// Example (modifiers apply to those in building, per hour?)
		'gym' : {
						"h":2,
						"w":2,

						"img": 'assets/buildings/gym.png', 

						"type": "gym",
						"capacity": 40,
						"running_costs": 900,
						"modifiers" : {"fitness": 5, "happiness": 1, "hunger": 5}
		},
		'library' : {
						"h":15,
						"w":5,

						"img": 'assets/buildings/library.png', 

						"type": "library",
						"capacity": 500,
						"running_costs": 900,
						"modifiers" : {"smartness": 2, "bordem": 1,"hunger": 1}
		},



		
	}
});