/**
 * Renderer
 * Responcible for "painting" world on to canvas in isometric style
 *
 * @package	model-uni
 */
define("game/client/renderer.js",[],
	function () {
		return new function() {

		
		// Required vars
		this.scene = null;
		this.viewport = null;
		this.map = null;
		this.building_config = null;
		// Cache of tile sprites
		this.layers = {}
		this.sprite_cache = {};

		/**
		 * init
		 * Set required values in to object & generate tile cache
		 *
		 * @param viewport - ref to game viewport
		 * @param map - ref to game map
		 * @param scene - ref to scene
		 */
		this.init = function(viewport, map, scene, buildings_config){
			// Keep a local copy of these values
			this.map = map;
			this.viewport = viewport;
			this.scene = scene;
			this.buildings_config = buildings_config;

			this.layers.world = scene.Layer("world",  {"useCanvas":true, "autoClear":false});


			// cache all tiles as sprites
			for(tile in this.map.tiles){
				this.sprite_cache[tile] = this.scene.Sprite(this.map.tiles[tile].img, { "layer": this.world });
			}
			// cache buildings as sprites
			for(building in buildings_config){
				this.sprite_cache[building] = this.scene.Sprite(buildings_config[building].img, { "layer": this.world });
			}
			// Add selector sprite
			this.sprite_cache['selector'] = this.scene.Sprite('assets/tiles/selector.png', { "layer": this.world })
			// Set viewport as dirty to trigger inital draw
			this.viewport.dirty = true; 
		}

		/** 
		 * tick: Called each time game loop runs
		 * checks if viewport is dirty (changes to be drawn) and draws world if so.
		 */
		this.tick = function(){
			console.log()
			if(this.viewport.is_dirty()){
				//redraw world if its dirty
				this.paintWorld();
				this.viewport.clean();
			}
		}
		/** 
		 * paintWorld
		 * re-paints current isometric world to the screen
		 *
		 * @todo Optimize this by not bothering to paint offscreen portions
		 */
		this.paintWorld = function(){
			
			var map = this.map;
			var tile_prop = map.tile_propeties;

			var world = this.layers.world;
			// Apply offsets
			var tile_x = offset_x = this.viewport.x;
			var tile_y = offset_y = this.viewport.y;
			//ref to current tile
			var current_tile;

			world.clear();

			for (var y = 0; y < map.h; y++) {
				for (var x = 0; x < map.w; x++) {
					current_tile = map.map[y][x];
					//draw tile
					this.sprite_cache[current_tile].position(tile_x, tile_y-(this.sprite_cache[current_tile].h % 65)).canvasUpdate(world);
		 		 	//draw structure
					if(typeof map.structure_map[y][x] != 'undefined' && map.structure_map[y][x] != null){

						if(typeof  map.structure_map[y][x].sprite !== 'undefined'){
							structure_name = map.structure_map[y][x].sprite;
							cfg = this.buildings_config[structure_name];
							sprite = this.sprite_cache[structure_name];

							this.sprite_cache[structure_name].position(tile_x-((cfg.w-1)*tile_prop.hw), tile_y-(sprite.h-tile_prop.h)).canvasUpdate(this.layers.world);
						}
					}

		 		 	tile_x += tile_prop.hw;
		 		 	tile_y += tile_prop.hh;
				}
				tile_x = (-tile_prop.hw * (y+1)) + offset_x;
				tile_y = (tile_prop.hh * (y+1)) +  offset_y;
			}
			// redraw selector
			this.paintSelector();
		}

		/**
		 * Draw selector on to canvas
		 * selector indicates which tile user is hovering on
		 */
		this.paintSelector = function(){
			//selected_tile
			s = game.findTileCoords(this.viewport.selected_tile.x, this.viewport.selected_tile.y);
			this.sprite_cache["selector"].position(s.x, s.y).canvasUpdate(this.layers.world);
		}
		/**
		 * Scale canvas 
		 * @param scale - scale factor
		 */
		this.scale = function(scale){


			world = this.layers.world;
			world.dom.style[sjs.tproperty+"Origin"] = "0 0";
		    world.dom.style[sjs.tproperty] = "scale(" + scale + "," + scale + ")";
		    world.dom.width = this.scene.w/scale *1;
		    world.dom.height = this.scene.h/scale *1;

		    // if viewport is dirty, map will be redrawn
		    this.viewport.dirty = true;
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