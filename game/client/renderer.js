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
		// humans
		this.entities = null;

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
			this.layers.entities = scene.Layer("entities",  {"useCanvas":true, "autoClear":false});
			this.layers.buildings = scene.Layer("buildings",  {"useCanvas":true, "autoClear":false});

			// cache all tiles as sprites
			for(tile in this.map.tiles){
				
				this.sprite_cache[tile] = this.scene.Sprite(this.map.tiles[tile].img, { "layer": this.layers.world });
				
				// If layered, sprites change settings
				if(typeof this.map.tiles[tile].layer !== 'undefined'){
					this.sprite_cache[tile]._baselayer = this.map.tiles[tile].type;
					this.sprite_cache[tile].layer = this.layers.buildings;
				}
			}
			// cache buildings as sprites
			for(building in buildings_config){
				this.sprite_cache[building] = this.scene.Sprite(buildings_config[building].img, { "layer": this.layers.buildings });
			}

			// Add student sprites
			this.sprite_cache["students"] = this.scene.Sprite("assets/people/students.png", { "layer": this.layers.entities });

			// Add selector sprite
			this.sprite_cache['selector'] = this.scene.Sprite('assets/tiles/selector.png', { "layer": this.layers.world });
			// Set viewport as dirty to trigger inital draw
			this.viewport.dirty = true; 
		}
		this.setEntities = function(entities){
			this.entities = entities;
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
			this.paintEntities();
		}

		// Use counter step (100 steps between action) combined with direction
		// to twean move animations for humans
		this.findHumanAnimationStep = function(move_percent, direction){
			x = move_percent = move_percent/2;
			y = move_percent/2;
			//down is already correct
			if(direction=='up'){x = -x; y = -y;}
			if(direction=='left')x = -x;
			if(direction=='right')y = -y;
			
			x = 50 + x;
			y = 25 + y;

			return {x: Math.floor(x), y : Math.floor(y)};
		}

		this.paintEntities = function(){

			this.layers.entities.clear();

			for (var s = 0; s < this.entities.students.length; s++) {
				var student = this.entities.students[s];

				if(student !== null && student.visable){

					pos = game.findTileCoords(student.x, student.y);
					step = this.findHumanAnimationStep(student.counter, student.next_direction());

					this.sprite_cache[student.sprite_type]
						.position(pos.x+step.x+student.x_offset, pos.y+step.y+student.y_offset)
						.size(5,13)
						.setXOffset(student.sprite_instance*6)
						.canvasUpdate(this.layers.entities);
				}
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

			// Apply offsets
			var tile_x = offset_x = this.viewport.x;
			var tile_y = offset_y = this.viewport.y;

			//clear world
			this.layers.world.clear();
			this.layers.buildings.clear();

			// Scope vars
			var layer_1, 
				layer_2, 
				current_structure, 
				current_tile,
				layer_2_offset_x,
				layer_2_offset_y;

			// For each tile
			for (var y = 0; y < map.h; y++) {
				for (var x = 0; x < map.w; x++) {

					layer_1 = current_tile = map.map[y][x];
					// Blank vars
					layer_2 = false;
					layer_2_offset_x=0;
					layer_2_offset_y=0;

					// if tile has multiple layers, use "_baselayer" as layer 1
					if(typeof this.sprite_cache[current_tile]._baselayer !== 'undefined'){
						layer_1 = this.sprite_cache[current_tile]._baselayer;
						layer_2 = current_tile;
						layer_2_offset_y = -(this.sprite_cache[current_tile].h-tile_prop.h);
					}

					// Buildings override layered tiles for access to layer_2 (sorry tiles)
					current_structure = map.structure_map[y][x];
					if(typeof current_structure != 'undefined' && current_structure != null){
						if(typeof current_structure.sprite !== 'undefined'){

							structure_name = map.structure_map[y][x].sprite;
							cfg = this.buildings_config[structure_name];
							sprite = this.sprite_cache[structure_name];

							layer_2 = structure_name;
							layer_2_offset_x = -(sprite.w-tile_prop.w) + ((cfg.w-1) * tile_prop.hw);
							layer_2_offset_y = -(sprite.h-tile_prop.h);
						}
					}

					// Draw Layer 1 (Base tile)
					this.sprite_cache[layer_1].position(tile_x, tile_y-(this.sprite_cache[layer_1].h - 65)).canvasUpdate();
					
					// Draw layer 2 if there is one.
					if(layer_2 !== false){
						this.sprite_cache[layer_2].position(tile_x + layer_2_offset_x, tile_y + layer_2_offset_y).canvasUpdate();
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
			// Draw to buildings layer (as this is the front most one)
			this.sprite_cache["selector"].position(s.x, s.y).canvasUpdate(this.layers.buildings);
		}
		/**
		 * Scale canvas 
		 * @param scale - scale factor
		 */
		this.scale = function(scale){

			for(var layer in this.layers){
				world = this.layers[layer];
				world.dom.style[sjs.tproperty+"Origin"] = "0 0";
			    world.dom.style[sjs.tproperty] = "scale(" + scale + "," + scale + ")";
			    world.dom.width = this.scene.w/scale *1;
			    world.dom.height = this.scene.h/scale *1;	
			}
		

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