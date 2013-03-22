define("game/map/tiles.js",[],
// content
function () {
	var tiles;
	return tiles ={

		// Normal tiles (generated)
		'trees' : {
			"img": 'assets/tiles/grass_wtree.png',
			"type": "grass"
		},

		'lot_w' : {"img": 'assets/tiles/lotW.png',"type": 'big_road'},
		'lot_e'   : {"img": 'assets/tiles/lotE.png', type: 'big_road'},

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

		// placeable tiles
		'grass' : {
			"img": 'assets/tiles/grass.png',
			"type": "grass"
		},
		'road' : {
			"img": 'assets/tiles/road.png',
			"type": 'road',
			"listeners": {},
			"findTile": function(left, top, right, bottom){

				var join_left = false, join_top = false, join_right = false, join_bottom = false;
				// find surrouinding types
				if(tiles[left].type == "road"){
					join_left = true;
				}
				if(tiles[top].type == "road"){
					join_top = true;
				}
				if(tiles[right].type == "road"){
					join_right = true;
				}
				if(tiles[bottom].type == "road"){
					join_bottom = true;
				}

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
			"findTile": function(left, top, right, bottom){
				/*
				var join_left = false, 
					join_top = false, 
					join_right = false, 
					join_bottom = false;
					// find surrouinding types
					if(tiles[left].type == "road"){join_left = true;}
					if(tiles[top].type == "road"){join_top = true;}
					if(tiles[right].type == "road"){join_right = true;}
					if(tiles[bottom].type == "road"){join_bottom = true;}
				*/
				return false;
			}
		}
	}
});