define("game/map/map.js",
	// dependencies
	['game/map/map.generator.js', 'game/map/tiles.js'],
	// content
	function (gen, tiles) {
		return new function() {

			this.w = 0;
			this.h = 0;
			
			this.map = [];
			this.tiles = tiles;
			this.tile_propeties = {"w":100, "h":50, "hw": 50, "hh": 25};


			this.load = function(){

			}
			this.save = function(){
				
			}
			this.new = function(w,h){
				this.w = w;
				this.h = h;
				this.map = gen.createMap(w,h);
				return this;
			}

			this.updateTile = function(x, y, new_tile){

				// Valid tile?
				if(x>0 && x < (this.w-1) && y>0 && y < (this.h-1) ){

					original_tile = this.map[x][y];

					// cannot place tiles on none-editable tiles 
					if(this.tiles[original_tile].editable === false && typeof new_tile != "undefined") return;

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
		}
	});