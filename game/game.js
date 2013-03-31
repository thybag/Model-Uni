/**
 * Game: Model-uni
 * Main game class for "Model uni" university simulation game.
 *
 * @package	model-uni
 */
define("game/game.js",
	// dependencies
	[
		'game/map/map.js',
		'game/client/ui.js',
		'game/client/viewport.js',
		'game/client/user.js',
		'game/client/renderer.js',
		'game/sim/simulation.js'	
	],
	function (map) {
		return new function() {	

			// Standard inputs disabled? (used for when interacting with a dialog)
			this.disable_input = false;

			// Load viewport
			this.viewport = require("game/client/viewport.js");
			// Load render
			this.renderer = require("game/client/renderer.js");
			// Load "user"
			this.user = require("game/client/user.js"); 
			// Set UI
			this.ui =  require("game/client/ui.js");
			// Load the simulation itself
			this.sim =  require("game/sim/simulation.js");
			// world (set in constructor)
			this.map = null;

			// Make game, global
			game = this;

			/** 
			 * __construct, initiates the game
			 *
			 */
			this.__construct = function(){

				// Does the user have saves?
				if(this.has_saves()){
					// If so, load their save
					this.map = map;
					this.load_game();
				}else{
					// else create a new map
					this.map = map.new(50,50);
				}
				
				// connect inputs
				this.inputs = this.scene.Input();

				// Setup render
				this.renderer.init(this.viewport, this.map, this.scene, this.sim.buildings_config);
				this.renderer.setEntities(this.sim.entities);

				// make world scalable
				document.addEventListener('mousewheel', function(e){

					// Zoom in
					if(e.wheelDelta > 0){
						if(game.viewport.scale.toFixed(1) == 1.5) return;
						game.viewport.scale += 0.1;
					}else{
						// Zoom out
						if(game.viewport.scale.toFixed(1) == 0.1) return;
						game.viewport.scale -= 0.1;
					}
					// Apply change
					game.renderer.scale(game.viewport.scale);

				}, false);


				// Make game "area" resizable
				$(window).resize(function() {

					// calc new width and heights
					var new_height = window.innerHeight -30;
					var new_width = window.innerWidth;
					// Adjust canvas heights for scaling
					canvas_height = new_height / game.viewport.scale;
					canvas_width = new_width / game.viewport.scale;
					// Update game
					game.scene.w = new_width;
					game.scene.h = new_height;
					// update canvas's
					canvas = $("canvas").attr("width",canvas_width).attr("height",canvas_height);
					// And canvas parent..
					$(canvas[0].parentNode).css("width",new_width+'px').css("height",new_height+'px');
					// tell game we now need to redraw
					 game.viewport.dirty = true;
				});

				// Show build Menu
				this.ui.init();

				// Show "newGame" dialog if user is starting a new game
				if(!this.has_saves()){
					this.ui.newGame();
				}else{
					// If not, just set the Uni name
					$('#uni-title').text(this.sim.data.university_name);
				}
			}
			
			/** 
			 * Tick: 
			 * Called each time game loop runs
			 * checks inputs, then runs simulaton logic & render
			 */
			this.tick = function(){ 
				// Check inputs
				this.checkInputs();
				// run simulation
				this.sim.tick();
				// render results to UI & Renderer
				this.ui.tick();
				this.renderer.tick();
			}

			/** 
			 * findTileCoords
			 * Converts tile coordiantes to real browser coordianates
			 *
			 * @param (int) x
			 * @param (int) y
			 * @return {x:y}
			 */
			this.findTileCoords = function (x, y){
				// Load tile sizes
				var tile_prop = this.map.tile_propeties;
				// Find top left corner of tile given its map coords
				real_y = this.viewport.y + (y*tile_prop.hh) + (x*tile_prop.hh);
				real_x = this.viewport.x + (y*tile_prop.hw) - (x*tile_prop.hw);

				return {"x": real_x, "y": real_y};
			} 

			/** 
			 * findTileAt
			 * Given a set of browser coordiantes, dertime which tile these are in.
			 *
			 * Solution based on:
			 * http://stackoverflow.com/questions/10768865/isometry-incorrect-coordinates-from-mouse-pos-tile-coords-formula
			 *
			 * @param (int) x
			 * @param (int) y
			 * @return {x:y}
			 */
			this.findTileAt = function(x, y){
				// Get tile properties
				var tile_prop 	= this.map.tile_propeties,
					tile_h 		= tile_prop.h,
					tile_w 		= tile_prop.w;

				// Define required vars
				var xIso, yIso, tile_real, local_x, local_y;

				// Scale x, y point coord to match game world scale.	
				y = y / game.viewport.scale;
				x = x / game.viewport.scale;

				// Remove offsets to give x,y coords relative to start of tiles.
				y = (y - this.viewport.y);
				x = (x - this.viewport.x);

				// figure out roughly which tile the x,y point is within
				yIso = Math.floor( ((y / tile_h) + (x /  tile_w)) );
				xIso = Math.floor( ((y / tile_h) - (x / tile_w))   );

				// Find the exact coordiantes of the tile we think the point is in.
				tile_real = this.findTileCoords(xIso, yIso);

				// Where is to point in relation to the real tile
				// Local x/y
				var local_x = x - (tile_real.x - this.viewport.x);
				var local_y = y - (tile_real.y - this.viewport.y);

				// Use local x/y to apply corrections to tile selection
				local = {"x": local_x, "y": local_y};
				if(this.outsideLine({x:50, y:0},{x:0, y:25}, 	local)) yIso--; // 1 up, left
				if(this.outsideLine({x:0, y:25},{x:50, y:50}, 	local)) xIso++; // 1 down, left
				if(this.outsideLine({x:50, y:50},{x:100, y:25}, local)) yIso++; // 1 up, right
				if(this.outsideLine({x:100, y:25},{x:50, y:0}, 	local))	xIso--; // 1 down, right
				
				// Return correct tile X/Y + tiles real x,y browser coords
				return {"x": xIso, "y": yIso, "px_x": tile_real.x, "px_y":tile_real.y}
			}

			/** 
			 * outsideLine
			 * Is point "c" above of line a:b ?
			 *
			 * @param (coord) a {x:y}  - line, point A
			 * @param (coord) b {x:y} - line, point B
			 * @param (coord) c {x:y} - point to test
			 * @return (bool) true|false
			 */
			this.outsideLine = function(a,b,c){
				return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;
			}

			/** 
			 * Check Inputs
			 * Detect user inputs & perform actions specified.
			 */
			this.checkInputs = function(){

				// If inputs are disabled, nothing in here needs to happen
				if(this.disable_input)return;

				// Useful data
				var mouse = this.inputs.mouse.position;
				var client = this.scene;
				var edge_boundry = 50;
				
				// Main vars
				var selected_tile = this.findTileAt(mouse.x, mouse.y);
				var tile_is_clear = this.map.isTileClear(selected_tile.x, selected_tile.y);

				// Update selected tile position
				if(this.viewport.selected_tile.x != selected_tile.x || this.viewport.selected_tile.y != selected_tile.y){
					
					// @todo change cursor when placing buildings (maybe a see through copy?)

					this.viewport.selected_tile = selected_tile;
    				this.viewport.dirty = true;
				}

				// Single click actions
				if(this.inputs.mouse.click){

					if(tile_is_clear){
						//If building a building
						if(this.user.selection_type == 'building'){
								var build = this.sim.createBuilding(selected_tile.x, selected_tile.y, this.user.selected);
								this.map.placeBuilding(build);
								this.viewport.dirty = true;
								this.sim.cash.spend(build.cost);
						}

					}else{
						// Dialogs
						structure = this.map.buildingAt(selected_tile.x, selected_tile.y);
						if(structure !== false){
							building = this.sim.getBuildingById(structure.id);
							game.ui.showRoomInfoDialog(building);
						}
					}
				}

				// Drag actions (if click action didnt take place)
				if(this.inputs.mousedown) {

					// If tile is clear
					if(tile_is_clear){

						if(this.user.selection_type == 'tile'){
							// if tile, attempt to place
							this.map.updateTile(selected_tile.x, selected_tile.y, this.user.selected);

							this.sim.cash.spend(this.map.findTileCost(this.user.selected));
							this.viewport.dirty = true;
						}

					}else{	

						// cant build here - but if we are demolishing
						if(this.user.selection_type == 'demolish'){

							var selection = this.map.tileAt(selected_tile.x, selected_tile.y);
							if(selection == 'structure'){

								// get building details
								structure = this.map.buildingAt(selected_tile.x, selected_tile.y);
								building = this.sim.getBuildingById(structure.id);

								// Remove from map
								this.sim.removeBuilding(building);
								this.map.removeBuilding(building);
								this.sim.cash.spend(500);
							}else{
								this.map.updateTile(selected_tile.x, selected_tile.y, this.user.selected);
								this.sim.cash.spend(5);//demolishing costs monies
							}
							this.viewport.dirty = true;
						}
					}
				}
				// Detect movement
				var move_distance = 5/this.viewport.scale;
				
				if(mouse.x < edge_boundry){
					this.viewport.x += move_distance;
				} 
				if(mouse.x > client.w-edge_boundry){
					this.viewport.x -= move_distance;
				}
				if(mouse.y < edge_boundry){
					this.viewport.y += move_distance;
				} 
				if(mouse.y > client.h-edge_boundry-40){
					this.viewport.y -= move_distance;
				}

				// constrain
				if(this.viewport.y > 200)this.viewport.y = 200;
				y_min_bound = -((this.map.h*50)-200);
				if(this.viewport.y < y_min_bound)this.viewport.y = y_min_bound;
			}

			/** 
			 * Save Game
			 * Save games current state to local storage
			 */
			this.save_game = function(){
				if(window.store.enabled){

					tmp = {};
					tmp.mapdata = this.map.forSave();
					tmp.sim = this.sim.forSave();
					store.set('map', tmp);
					console.log("game saved");
				}else{
					alert("unable to save!");
				}
			}

			/** 
			 * Does the user have any saved games?
			 * @return (bool) true|false
			 */
			this.has_saves = function(){
				return (window.store.enabled && typeof store.get('map') !== 'undefined');
			}

			/** 
			 * Load game from save
			 */
			this.load_game = function(){
				if(window.store.enabled){
					console.log("game loaded");

					tmp = store.get('map');
					this.map.load(tmp.mapdata);
					this.sim.load(tmp.sim);
				}
			}
			
			/** 
			 * Create a new game
			 * Currently will delete old saves
			 */
			this.new_game = function(){
				store.clear();
				document.location.reload();
			}
		}		
	}
);