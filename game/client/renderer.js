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
		// Cache of tile sprites
		this.layers = {}
		this.tile_cache = {};

		/**
		 * init
		 * Set required values in to object & generate tile cache
		 *
		 * @param viewport - ref to game viewport
		 * @param map - ref to game map
		 * @param scene - ref to scene
		 */
		this.init = function(viewport, map, scene){
			// Keep a local copy of these values
			this.map = map;
			this.viewport = viewport;
			this.scene = scene;

			this.layers.world = scene.Layer("world",  {"useCanvas":true, "autoClear":false});
	//var players = scene.Layer("players",  {"useCanvas":true, "autoClear":false});
	//var ui = scene.Layer("ui",  {"useCanvas":true, "autoClear":true});

			// cache all tiles as sprites
			for(tile in this.map.tiles){
				this.tile_cache[tile] = this.scene.Sprite(this.map.tiles[tile].img, { "layer": this.world });
			}
			// Add selector tile
			this.tile_cache['selector'] = this.scene.Sprite('assets/tiles/selector.png', { "layer": this.world })
			// Set viewport as dirty to trigger inital draw
			this.viewport.dirty = true; 
		}

		/** 
		 * tick: Called each time game loop runs
		 * checks if viewport is dirty (changes to be drawn) and draws world if so.
		 */
		this.tick = function(){

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

					this.tile_cache[current_tile].position(tile_x, tile_y-(this.tile_cache[current_tile].h % 65)).canvasUpdate(world);
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
			s = game.findTileCoords(this.viewport.selected_tile.x, this.viewport.selected_tile.y)
			this.tile_cache["selector"].position(s.x, s.y).canvasUpdate(this.layers.world);
		}
		/**
		 * Scale canvas 
		 * @param scale - scale factor
		 */
		this.scale = function(scale){


			world = this.world;
			world.dom.style[sjs.tproperty+"Origin"] = "0 0";
		    world.dom.style[sjs.tproperty] = "scale(" + scale + "," + scale + ")";
		    world.dom.width = this.world.scene.w/scale *1;
		    world.dom.height = this.world.scene.h/scale *1;

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