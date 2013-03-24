/**
 * Map
 * map of the game world, defines what tiles & entities there are as well as there positions
 * All changes to "map" come through here
 *
 * @package	model-uni.map
 */
define("game/map/map.js",
// dependencies
['game/map/map.generator.js', 'game/map/tiles.js', 'vendor/astar.min.js'],
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
		// Used for path finding
		this.graph = null;

		// tile
		this.tiles = tiles;

		// Tile propeties
		this.tile_propeties = {"w":100, "h":50, "hw": 50, "hh": 25};

		/**
		 * New - Create new map
		 *
		 * @param w - map width
		 * @param h - map height
		 */
		this.new = function(w,h){
			this.w = w;
			this.h = h;
			this.map = gen.createMap(w,h);
			this.structure_map = gen.emptyMap(w,h);
			this.makeGraph();
			return this;
		}

		/**
		 * Load - load an existing map
		 *
		 * @param data - Map data payload (from save)
		 */
		this.load = function(data){
			// Set key data
			this.w = data.w;
			this.h = data.h;
			this.map = data.map;

			// Allow saved maps to still work (@todo remove me)
			if(typeof data.structure_map == 'undefined'){
				this.structure_map = gen.emptyMap(this.w,this.h);
			}else{
				this.structure_map = data.structure_map;
			}	

			this.makeGraph();
		}

		/**
		 * placeBuilding - Add building to the "visable" world
		 * Set details needed to make building entities renderable & selectable by user.
		 *
		 * @param building - Building object
		 */
		this.placeBuilding = function(building){

			// Phyiscal position (for rendering)
			y = building.y;
			x = building.x;

			// Find out what other tiles building occupies
			_y = y-(building.h-1);
			_x = x-(building.w-1);

			// Set structure to map & add reverse references to structure_map
			for(tmp_y = y; tmp_y >= _y; tmp_y--){
				for(tmp_x = x; tmp_x >= _x; tmp_x--){

					this.updateTile(tmp_x, tmp_y, "structure", true);
					// Add references for use by Id lookups
					this.structure_map[tmp_x][tmp_y] = {"id": building.id}
				}
			}	
			// Add reference for use by renderer
			this.structure_map[x][y] = {"id": building.id, "sprite": building.name};
		}

		/**
		 * removeBuilding - remove building from "visable" world
		 * Removes references to simulated "building" from map
		 *
		 * @param building - Building object
		 */
		this.removeBuilding = function(building){

			y = building.y;
			x = building.x;
			// Find building constraints
			_y = y-(building.h-1);
			_x = x-(building.w-1);
			// Tiles set to grass, and structure map nulled
			for(tmp_y = y; tmp_y >= _y; tmp_y--){
				for(tmp_x = x; tmp_x >= _x; tmp_x--){
					this.updateTile(tmp_x, tmp_y, "grass", true);
					this.structure_map[tmp_x][tmp_y] = null;
				}
			}	
		}

		/**
		 * buildingAt
		 * If building exists at tile, returns lookup data, else false.
		 *
		 * @param x - map coord
		 * @param y - map coord
		 * @return {id} | false
		 */
		this.buildingAt = function(x, y){
			if(x>0 && x < (this.w-1) && y>0 && y < (this.h-1) ){
				if(this.map[x][y] == 'structure'){
					return this.structure_map[x][y];
				}	
			}
			return false;
		}

		/**
		 * tileAt
		 * name of tile at specified position (false if outside map)
		 *
		 * @param x - map coord
		 * @param y - map coord
		 * @return "tile name" | false
		 */
		this.tileAt = function(x, y){
			if(x>0 && x < (this.w-1) && y>0 && y < (this.h-1) ){
				return this.map[x][y];
			}else{
				return false;
			}
		}

		/**
		 * isTileClear
		 * is tile free to be built on?
		 *
		 * @param x - map coord
		 * @param y - map coord
		 * @return (bool) true | false
		 */
		this.isTileClear = function(x, y){
			var tile = this.tileAt(x, y);
			// tile is free, if it both exists an is grass
			return (tile !== false && tile == 'grass');
		}

		/**
		 * updateTile
		 * Place new tile on to map, validting position, editability of tile & propegating changes
		 * to near by tile to allow tiles to link together (such as roads)
		 *
		 * @param x - map coord
		 * @param y - map coord
		 * @param new_tile - name of type to place (normally a "type")
		 * @param force - Ignore tile constraints (used internally only)
		 */
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

		this.makeGraph = function(){
			var nodes = gen.emptyMap(this.h,this.w);
			for(var x=0; x<this.w;x++){
				for(var y=0; y<this.h;y++){

					if(this.tiles[this.map[x][y]].type == 'road'){
						nodes[x][y] = 1;
					}else if(this.map[x][y] == 'structure'){
						nodes[x][y] = 0;
					}else{
						nodes[x][y] = 5;
					}
				}
			}
			console.log(nodes);
			this.graph = new Graph(nodes);
		}

		this.findPath = function (from, to){
			return astar.search(this.graph.nodes, this.graph.nodes[from.x][from.y], this.graph.nodes[to.x][to.y])
		}

		/**
		 * forSave
		 * format Map data for saving
		 *
		 * @return (Object) map data
		 */
		this.forSave = function(){
			return {"w": this.w, "h": this.h, "map" : this.map, "structure_map": this.structure_map};
		}	
	}
});