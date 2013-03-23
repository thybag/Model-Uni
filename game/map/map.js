/**
 * Map
 * map of the game world, defines what tiles & entities there are as well as there positions
 * All changes to "map" come through here
 *
 * @package	model-uni.map
 */
define("game/map/map.js",
// dependencies
['game/map/map.generator.js', 'game/map/tiles.js'],
// content
function (gen, tiles) {
	return new function() {

		// Map width/height
		this.w = 0;
		this.h = 0;

		// Terrain map
		this.map = [];
		// structure map
		this.structure_map = [];

		// tile
		this.tiles = tiles;

		// Tile propeties
		this.tile_propeties = {"w":100, "h":50, "hw": 50, "hh": 25};

		// Create a new map
		this.new = function(w,h){
			this.w = w;
			this.h = h;
			this.map = gen.createMap(w,h);
			this.structure_map = gen.emptyMap(w,h);
			this.structures 
			return this;
		}


		// Place a building 
		this.placeBuilding = function(building){

			y = building.y;
			x = building.x;
			this.structure_map[x][y] = building.name;

			_y = y-(building.h-1);
			_x = x-(building.w-1);

			for(y; y >= _y; y--){
				for(tmp_x = x; tmp_x >= _x; tmp_x--){
					this.updateTile(tmp_x, y,"structure", true);
				}
			}	
		}

		this.tileAt = function(x, y){
			if(x>0 && x < (this.w-1) && y>0 && y < (this.h-1) ){
				return this.map[x][y];
			}else{
				return false;
			}
		}

		this.removeBuilding = function(building){
		}


		// Place a tile
		this.updateTile = function(x, y, new_tile, force){

			// Valid tile?
			if(x>0 && x < (this.w-1) && y>0 && y < (this.h-1) ){

				original_tile = this.map[x][y];

				// cannot place tiles on none-editable tiles (unless force is set)
				if(typeof force == "undefined" && this.tiles[original_tile].editable === false && typeof new_tile != "undefined") return;

				// if new tile not provided, use current value
				if(typeof new_tile == "undefined"){
					new_tile = original_tile;
				}

				tiledata = this.tiles[new_tile];
				// use type to determine action
				if(typeof tiledata.type !== 'undefined') tiledata = this.tiles[tiledata.type];
				// if action defined, apply it
				if(typeof tiledata.findTile !== 'undefined'){
					
					tile = tiledata.findTile(this.map[x+1][y], this.map[x][y-1], this.map[x-1][y] , this.map[x][y+1])
					if(tile == false)return;
				}else{
					//  no change?
					tile = new_tile;
				}

				this.map[x][y] = tile;

				// trigger changes on near by tiles if this tile has changed
				if(tile != original_tile){
					//console.log("i have changed dude!");
					this.updateTile(x+1, y);
					this.updateTile(x, y-1);
					this.updateTile(x-1, y);
					this.updateTile(x, y+1);
				}	
			}
		}

		// Load map from save
		this.load = function(data){
			this.w = data.w;
			this.h = data.h;
			this.map = data.map;

			// Allow saved maps to still work (@todo remove me)
			if(typeof data.structure_map == 'undefined'){
				this.structure_map = gen.emptyMap(this.w,this.h);
			}else{
				this.structure_map = data.structure_map;
			}
			
		}
		// generate data to save a map
		this.forSave = function(){
			return {"w": this.w, "h": this.h, "map" : this.map, "structure_map": this.structure_map};
		}	
	}
});