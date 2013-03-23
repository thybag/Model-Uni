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
		'game/client/renderer.js'	
	],
	function (map, ui) {
		return new function() {	

			// Load viewport
			this.viewport = require("game/client/viewport.js");
			// Load render
			this.renderer = require("game/client/renderer.js");
			// Load "client"
			this.client = new function(){
				this.selected_tile = 'road';
			}

			// Set UI
			this.ui = ui;

			// actors (live stuff)
			this.entities = [];

			// world (set in constructor)
			this.map = null;

			//debug
			here = game = this;

			/** 
			 * __construct, initiates new game
			 *
			 */
			this.__construct = function(){

				// Generate new MAP
				if(this.has_saves()){
					this.map = map;
					this.load_game();
				}else{
					this.map = map.new(50,50);
				}
				

				// connect inputs
				this.inputs = this.scene.Input();

				// Setup render
				this.renderer.init(this.viewport, this.map, this.world);

				// make scalable
				document.addEventListener('mousewheel', function(e){
					if(e.wheelDelta > 0){
						//max size
						
						if(game.viewport.scale.toFixed(1) == 1.5) return;
						//in
						game.viewport.scale += 0.1;
					}else{
						// 0.1 = min size
						if(game.viewport.scale.toFixed(1) == 0.1) return;
						game.viewport.scale -= 0.1;
						// out
					}
					game.renderer.scale(game.viewport.scale);

				}, false);

				// Make game resizable
				$(window).resize(function() {

					// calc new width and heights
					var new_height = window.innerHeight -30;
					var new_width = window.innerWidth;
					// Adjust canvas heights for scaling
					canvas_height = new_height / game.viewport.scale;
					canvas_width = new_width / game.viewport.scale;

					// Update game
					game.world.scene.w = new_width;
					game.world.scene.h = new_height;
					// update canvas's
					canvas = $("canvas").attr("width",canvas_width).attr("height",canvas_height);
					// And canvas parent..
					$(canvas[0].parentNode).css("width",new_width+'px').css("height",new_height+'px');
					// tell game we now need to redraw
					 game.viewport.dirty = true;
				});

				// Show build Menu
				ui.showMenu();
			}
			
			/** 
			 * tick: Called each time game loop runs
			 * checks inputs, then runs simulaton logic & render
			 */
			this.tick = function(){ 
				this.check_inputs();
				//this.sim.run();
				this.renderer.tick();
			}

			// Convert tile X/Y to real position (in pix)
			this.findTileCoords = function (x, y){
				var tile_prop = this.map.tile_propeties;
				// Find top left corner of tile given its map coords
				real_y =  (this.viewport.y + (y*tile_prop.hh) + (x*tile_prop.hh));// * this.viewport.scale;
				real_x =  (this.viewport.x + (y*tile_prop.hw) - (x*tile_prop.hw));// * this.viewport.scale;

				return {x: real_x, y: real_y};

			} 

			// Detect which tile a particular point is in.
			this.findTileAt = function(x, y){
				//http://stackoverflow.com/questions/10768865/isometry-incorrect-coordinates-from-mouse-pos-tile-coords-formula
				
				var tile_prop = this.map.tile_propeties;
				y = y/ game.viewport.scale;
				x = x/ game.viewport.scale;
				// Remove offsets
				y = (y - this.viewport.y) ;
				x = (x - this.viewport.x);

				// figure out roughly which tile has been selected
				tile_h = tile_prop.h ;
				tile_w = tile_prop.w ;

				yIso = Math.floor( ((y / tile_h) + (x /  tile_w)) );
				xIso = Math.floor( ((y / tile_h) - (x / tile_w))   );


				// Get real tile position
				tile_real = this.findTileCoords(xIso,yIso);

				// Find local position within found tile.
				local_x = x - (tile_real.x - this.viewport.x);
				local_y = y - (tile_real.y - this.viewport.y);
				// Use local to apply corrections to tile selection
				local = {"x":local_x, "y":local_y};

				if(this.outsideLine({x:50, y:0},{x:0, y:25}, local )){
					yIso--; // 1 up, left
					//console.log("correction applied 1");
				}
				if(this.outsideLine({x:0, y:25},{x:50, y:50}, local)){
					xIso++; // 1 down, left
					//console.log("correction applied 2");
				}
				if(this.outsideLine({x:50, y:50},{x:100, y:25}, local)){
					yIso++; // 1 up, right
					//console.log("correction applied 3");

				}
				if(this.outsideLine({x:100, y:25},{x:50, y:0}, local)){
					xIso--; // 1 down, right
					//console.log("correction applied 4");
				}
				
				return {"x": xIso, "y": yIso, "px_x": tile_real.x, "px_y":tile_real.y}

			}
			// Is point outside of line(a:b)
			this.outsideLine = function(a,b,c){
				return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;
			}

			var disable_scroll = false;
			this.check_inputs = function(){

				var mouse = this.inputs.mouse.position;
				var client = this.scene;
				var edge_boundry = 50;
				
				tt = this.findTileAt(mouse.x,mouse.y);
				if(this.viewport.selected_tile.x != tt.x || this.viewport.selected_tile.y != tt.y){
					this.viewport.selected_tile = tt;
    				this.viewport.dirty = true;
				}
				
				if(this.inputs.mousedown) {
					tile = this.findTileAt(mouse.x, mouse.y);
					this.map.updateTile(tile.x, tile.y, this.client.selected_tile);
					this.viewport.dirty = true;
				}

				$(".game-ui").hover(function(){
					disable_scroll = true;
				},function(){
					disable_scroll = false;
				});

				var move_distance = 5/this.viewport.scale;
				
				if(mouse.x < edge_boundry  && !disable_scroll){
					this.viewport.x += move_distance;
				} 
				if(mouse.x > client.w-edge_boundry && !disable_scroll){
					this.viewport.x -= move_distance;
				}
				if(mouse.y < edge_boundry && !disable_scroll){
					this.viewport.y += move_distance;
				} 
				if(mouse.y > client.h-edge_boundry-40 && !disable_scroll){
					this.viewport.y -= move_distance;
				}
			}

			// Save map (single save currently)
			this.save_game = function(){
				if(window.store.enabled){
					store.set('map', this.map.forSave())
					console.log("game saved");
				}else{
					alert("unable to save!");
				}
			}

			this.has_saves = function(){
				return (window.store.enabled && typeof store.get('map') !== 'undefined');
			}

			// Load map
			this.load_game = function(){
				if(window.store.enabled){
					console.log("game loaded");
					this.map.load(store.get('map'));
				}
			}
			this.new_game = function(){
				this.map.new(50,50);
			}
		}		
	}
);