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
						"title": "Student flat",
						"img": 'assets/buildings/student-flat.png', 
						"w" : 1,
						"h" : 1,
						"type": "accommodation",
						"capacity": 8,
						"cost": 5000,
						"running_costs": 250,
						"modifiers" : {"tiredness": -10, "hunger": 1, "bordem": 1},
						"stay_length":2
		},
		// Example (modifiers apply to those in building, per hour?)
		'gym' : {
						"title": "Student gym",
						"h":2,
						"w":2,

						"img": 'assets/buildings/gym.png', 

						"type": "fitness",
						"capacity": 40,
						"cost": 8000,
						"running_costs": 900,
						"modifiers" : {"fitness": 5, "happiness": 1, "hunger": 5, "bordem": -1},
						"stay_length":2
		},
		'library' : {	
						"title": "Library",
						"h":15,
						"w":5,

						"img": 'assets/buildings/Library.png', 

						"type": "education",
						"capacity": 500,
						"cost": 20000,
						"running_costs": 900,
						"modifiers" : {"smartness": 2, "bordem": 1, "hunger": 1},
						"stay_length":2
		},
		'campus_shop' : {
			"title" : "Campus shop",
			"h":1,
			"w":2,
			"img": 'assets/buildings/shop.png', 

			"capacity": 15,
			"cost": 7000,
			"running_costs": 500,
			"modifiers" : {"hunger": -8},
			"type":"food",
			"stay_length":1
		},
		'campus_shop2' : {
			"title" : "Campus shop",
			"h":2,
			"w":1,
			"img": 'assets/buildings/Student-Shop-min.png', 

			"capacity": 15,
			"cost": 7000,
			"running_costs": 500,
			"modifiers" : {"hunger": -8},
			"type":"food",
			"stay_length":1
		},
		'health_food_bar' : {
			type:"food"
		},
		'pizza_place' : {
			type:"food"
		},
		'burger_bar' : {
			type:"food"
		},


		'lecture_theatre' : {
			type:"education"
		},
		'bar' : {
			type:"fun"
		},
		'club' : {
			type:"fun"
		}



		
	}
});