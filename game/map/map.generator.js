/**
 * Map generator
 * generates new "world" maps
 *
 * @package	model-uni.map
 */
define("game/map/map.generator.js",
	// dependencies
	[],
	// content
	function () {
		return new function() {

			/**
			 * Generate basic map
			 *
			 * @param w - Width of map in tiles
			 * @param h - Height of map in tiles
			 */
			this.createMap = function(w,h){

				// Empty map array
				var map = [];
				// Create each tile
				for(var y=0; y<h;y++){
					for(var x=0; x<w;x++){
						// Initalise array if blank
						if(typeof map[y] === 'undefined')map[y]=[];

						// random chance of tree
						if(Math.floor((Math.random()*50)+1) == 10){
							map[y][x] = "trees";
						}else{
							map[y][x] = "grass";
						}
					}
				}
				// Draw road
				for(var y=0; y<h;y++){
					map[1][y] = "lot_e";	
					map[2][y] = "lot_w";	
				}
				
				return map;
			}
			
			/**
			 * Generate empty map
			 *
			 * @param w - Width of map in tiles
			 * @param h - Height of map in tiles
			 */
			this.emptyMap = function(w,h){
				var map = [];
				for(var y=0; y<h;y++){
					map[y] = new Array(w);
				}
				return map;
			}
		}
	});