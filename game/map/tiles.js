/**
 * Tiles
 * Define all the differnt tiles in the game, as well as there relations to one another
 * Tiles also define how they respond to other near by tiles (used to connect roads, rivers, whatever else automatically)
 *
 * @package	model-uni
 */
 define("game/map/tiles.js",[],
// content
function () {
	var tiles;
	return tiles ={

		// Normal tiles (generated)
		'trees' : {
			"img": 'assets/decorative/trees.png',
			"layer": true,
			"type": "grass",
			"cost": 150
		},

		'lot_w' : {"img": 'assets/tiles/lotW.png',"type": 'big_road', "editable": false},
		'lot_e'   : {"img": 'assets/tiles/lotE.png', "type": 'big_road', "editable": false},
		'lot_n'   : {"img": 'assets/tiles/lotN.png', "type": 'big_road', "editable": false},
		'lot_s'   : {"img": 'assets/tiles/lotS.png', "type": 'big_road', "editable": false},

		'lot_exit_n'   : {"img": 'assets/tiles/exitN.png', type: 'big_road', "editable": false},
		'lot_exit_e'   : {"img": 'assets/tiles/exitE.png', type: 'big_road', "editable": false},
		'lot_exit_s'   : {"img": 'assets/tiles/exitS.png', type: 'big_road', "editable": false},
		'lot_exit_w'   : {"img": 'assets/tiles/exitW.png', type: 'big_road', "editable": false},

		'road_ew' : {"img": 'assets/tiles/roadEW.png', type: 'road'},
		'road_ns' : {"img": 'assets/tiles/roadNS.png', type: 'road'},

		'road_end' 			: {"img": 'assets/tiles/road_end.png', type: 'road'},
		'road_end_n' 		: {"img": 'assets/tiles/endN.png', type: 'road'},
		'road_end_e' 		: {"img": 'assets/tiles/endE.png', type: 'road'},
		'road_end_s' 		: {"img": 'assets/tiles/endS.png', type: 'road'},
		'road_end_w' 		: {"img": 'assets/tiles/endW.png', type: 'road'},

		'road_corner_es' 		: {"img": 'assets/tiles/roadES.png', type: 'road'},
		'road_corner_ne' 		: {"img": 'assets/tiles/roadNE.png', type: 'road'},
		'road_corner_nw' 		: {"img": 'assets/tiles/roadNW.png', type: 'road'},
		'road_corner_sw' 		: {"img": 'assets/tiles/roadSW.png', type: 'road'},

		'road_crossroad'  	: {"img": 'assets/tiles/crossroad.png', type: 'road'},
		'road_crossroad_esw' : {"img": 'assets/tiles/crossroadESW.png', type: 'road'},
		'road_crossroad_nes' : {"img": 'assets/tiles/crossroadNES.png', type: 'road'},
		'road_crossroad_new' : {"img": 'assets/tiles/crossroadNEW.png', type: 'road'},
		'road_crossroad_nsw' : {"img": 'assets/tiles/crossroadNSW.png', type: 'road'},

		// Special placeholder tile
		'structure' : {
			//"img": 'assets/tiles/dirtDouble.png',
			"img": 'assets/tiles/grass.png',
			"terrain_cost": 500,
			"editable": false,
			"cost": 0,
		},

		// placeable tiles
		'grass' : {
			"img": 'assets/tiles/grass.png',
			"type": "grass",
			"terrain_cost": 5,
			"cost": 2
		},
		'road' : {
			"img": 'assets/tiles/road.png',
			"type": 'road',
			"terrain_cost": 1,
			"cost": 50,
			"findTile": function(left, top, right, bottom){

				var join_left 	= 	(tiles[left].type == "road" || tiles[left].type == "big_road" ),
				 	join_top 	= 	(tiles[top].type == "road" || tiles[top].type == "big_road"),
				 	join_right 	= 	(tiles[right].type == "road" || tiles[right].type == "big_road"),
				 	join_bottom = 	(tiles[bottom].type == "road" || tiles[bottom].type == "big_road");

				// find surrouinding types

				// Depending on join

				// cross roads
				if(join_top && join_bottom && join_left && join_right) return "road_crossroad";

				// 3 way?
				if(join_top && join_bottom && join_left) return "road_crossroad_nsw";
				if(join_top && join_bottom && join_right) return "road_crossroad_nes";
				if(join_top && join_right && join_left) return "road_crossroad_new";
				if(join_right && join_bottom && join_left) return "road_crossroad_esw";

				// both ends (straight)
				if(join_top && join_bottom) return "road_ns";
				if(join_left && join_right)	return "road_ew";

				// 2 ends (corner)
				if(join_top && join_left) return "road_corner_nw";
				if(join_top && join_right) return "road_corner_ne";
				if(join_bottom && join_left)return "road_corner_sw";
				if(join_bottom && join_right) return "road_corner_es";

				// Roads ends (one join)
				if(join_left)	return "road_end_w";
				if(join_right)	return "road_end_e";
				if(join_top)	return "road_end_n";
				if(join_bottom)	return "road_end_s";
				
				// no joins
				return "road_end";
			}
		},
		'big_road': {
			"img": 'assets/tiles/road.png',
			"type": 'bigroad',
			"terrain_cost": 1,
			"cost": 0,
			"findTile": function(left, top, right, bottom){

				var join_left 	= 	(tiles[left].type == "road"),
				 	join_top 	= 	(tiles[top].type == "road"),
				 	join_right 	= 	(tiles[right].type == "road"),
				 	join_bottom = 	(tiles[bottom].type == "road");

					if(join_left)	return "lot_exit_w";
					if(join_right)	return "lot_exit_e";
					if(join_top)	return "lot_exit_n";
					if(join_bottom)	return "lot_exit_s";

					if(tiles[left].type == 'big_road')return "lot_e";
					if(tiles[right].type == 'big_road')return "lot_w";

					return false;
			}
		}
	}
});