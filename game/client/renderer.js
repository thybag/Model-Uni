define("game/client/renderer.js",[],
	// content
	function () {
		return new function() {

		this.world = null;
		this.viewport = null;
		this.map = null;

		this.tile_cache = {};

		this.init = function(viewport, map, world){
			this.map = map;
			this.viewport = viewport;
			this.world = world ;

			console.log(viewport);
			console.log(this.world);
			// populate tile cache
			for(tile in this.map.tiles){
				this.tile_cache[tile] = this.world.scene.Sprite(this.map.tiles[tile].img, { "layer": this.world });
			}
			this.tile_cache['selector'] = this.world.scene.Sprite('assets/tiles/selector.png', { "layer": this.world })

			this.viewport.dirty = true; // inital draw
		}

		this.tick = function(){

			if(this.viewport.is_dirty()){
				//redraw world if its dirty
				this.paintWorld();
				this.viewport.clean();
			}
		}

		this.paintWorld = function(){
			
			var map = this.map;
			var tile_prop = map.tile_propeties;
			// Apply offsets
			var tile_x = offset_x = this.viewport.x;
			var tile_y = offset_y = this.viewport.y;
			//ref to current tile
			var current_tile;

			this.world.clear();

			for (var y = 0; y < map.h; y++) {
				for (var x = 0; x < map.w; x++) {
					current_tile = map.map[y][x];

					this.tile_cache[current_tile].position(tile_x, tile_y-(this.tile_cache[current_tile].h % 65)).canvasUpdate(this.world);
		 		 	tile_x += tile_prop.hw;
		 		 	tile_y += tile_prop.hh;
				}
				tile_x = (-tile_prop.hw * (y+1)) + offset_x;
				tile_y = (tile_prop.hh * (y+1)) +  offset_y;
			}

			this.paintSelector();
		}

		this.paintSelector = function(){
			//selected_tile
			s = game.findTileCoords(this.viewport.selected_tile.x, this.viewport.selected_tile.y)
			this.tile_cache["selector"].position(s.x, s.y).canvasUpdate(this.world);
		}

		this.scale = function(scale){


			world = this.world;
			world.dom.style[sjs.tproperty+"Origin"] = "0 0";
		    world.dom.style[sjs.tproperty] = "scale(" + scale + "," + scale + ")";
		    world.dom.width = this.world.scene.w/scale *1;
		    world.dom.height = this.world.scene.h/scale *1;

		    // if viewport is dirty, map will be redrawn
		    this.viewport.dirty = true;
		   // this.renderWorld(this.viewport.x, this.viewport.y);
		}
				
	}
});

/* highlight square DBG
	_final = this.findTileCoords(xIso,yIso);;
	aa = document.createElement('div');
	aa.style.position = 'absolute';
	aa.style.height = (tile_prop.h-2)*this.viewport.scale+'px';
	aa.style.width = (tile_prop.w-2)*this.viewport.scale+'px';
	aa.style.border = 'solid 1px red';
	aa.style.left = _final.x +'px';
	aa.style.top = 42+ _final.y+'px';
	aa.style.zIndex = '99999'; 
	document.body.appendChild(aa);
*/