var game;
define("game/simulation.js",
	// dependencies
	['game/map/map.js'],
	// content
	function (map) {
		return new function() {	

			this.viewport = new function() {
				this.x = 500;
				this._x = this.x;
				this.y = 200;
				this._y = this.y;
				this.scale = 1;
				this.is_dirty = function(){ return !(this.y == this._y && this.x == this._x)};
				this.clean = function(){ this._y = this.y; this._x = this.x; };
			}

			// actors (live stuff)
			this.entities = [];

			// world
			this.tiles = {};
			this.map = {};

		
			//debug
			here = game = this;

			var tile_prop = {"w":100, "h":50, "hw": 50, "hh": 25};

			this.__construct = function(){

				this.map = map.new(50,50);
				// inputs
				this.inputs = this.scene.Input();

				// populate tiles
				this.tiles = {
					"grass": this.scene.Sprite('assets/tiles/grass.png', { "layer": this.world }).scale(0.6),
					"trees": this.scene.Sprite('assets/tiles/grass_wtree.png', { "layer": this.world }),

					"lot_w": this.scene.Sprite('assets/tiles/lotW.png', { "layer": this.world }),
					"lot_e": this.scene.Sprite('assets/tiles/lotE.png', { "layer": this.world }),


					"road_ew": this.scene.Sprite('assets/tiles/roadNS.png', { "layer": this.world }),
					"road_ns": this.scene.Sprite('assets/tiles/roadEW.png', { "layer": this.world }),
					"road": this.scene.Sprite('assets/tiles/road.png', { "layer": this.world })
				}
	
				//this.tiles.get('assets/tiles/grass.png');
				this.renderWorld(this.viewport.x,this.viewport.y);

				// make scalable

				this.viewport.scale = 1;
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
					console.log(game.viewport.scale);
					here.scaleWorld(game.viewport.scale);

				}, false);

			}

			this.scaleWorld = function(scale){
				world = this.world;
				world.dom.style[sjs.tproperty+"Origin"] = "0 0";
			    world.dom.style[sjs.tproperty] = "scale(" + scale + "," + scale + ")";
			    world.dom.width = this.scene.w/scale *1;
			    world.dom.height = this.scene.h/scale *1;

			    this.renderWorld(this.viewport.x, this.viewport.y);
			}

			this.renderWorld = function(offset_x, offset_y){
				var tile_x = offset_x;
				var tile_y = offset_y;
				var current_tile;

				for (var y = 0; y < map.h; y++) {
					for (var x = 0; x < map.w; x++) {
						current_tile = map.map[y][x];

						this.tiles[current_tile].position(tile_x, tile_y-(this.tiles[current_tile].h % 65)).canvasUpdate(this.world);
			 		 	tile_x += tile_prop.hw;
			 		 	tile_y += tile_prop.hh;
					}
					tile_x = (-tile_prop.hw * (y+1)) + offset_x;
					tile_y = (tile_prop.hh * (y+1)) +  offset_y;
				}

			}


			this.tick = function(){ 
				this.run();

				this.render();
			}


			this.findTileCoords = function (x, y){
				// Find top left corner of tile given its map coords
				real_y =  (this.viewport.y + (y*tile_prop.hh) + (x*tile_prop.hh)) * this.viewport.scale;
				real_x =  (this.viewport.x + (y*tile_prop.hw) - (x*tile_prop.hw)) * this.viewport.scale;

				return {x: real_x, y: real_y};

			} 
			this.findTileAt = function(x, y){
				//http://stackoverflow.com/questions/10768865/isometry-incorrect-coordinates-from-mouse-pos-tile-coords-formula
				
				// Remove offsets
				y = (y - this.viewport.y);
				x = (x - this.viewport.x);

				// figure out roughly which tile has been selected
				tile_h = tile_prop.h;
				tile_w = tile_prop.w;

				yIso = Math.floor( ((y / tile_h) + (x /  tile_w)));
				xIso = Math.floor( ((y / tile_h) - (x / tile_w)));

				// Get real tile position
				tile_real = this.findTileCoords(xIso,yIso);

				// Find local position within found tile.
				local_x = x - (tile_real.x - this.viewport.x);
				local_y = y - (tile_real.y - this.viewport.y);
				// Use local to apply corrections to tile selection
				local = {"x":local_x, "y":local_y};

				if(this.outsideLine({x:50, y:0},{x:0, y:25}, local )){
					yIso--; // 1 up, left
					//console.log("should be on up (left)");
				}else if(this.outsideLine({x:0, y:25},{x:50, y:50}, local)){
					xIso++; // 1 down, left
				}else if(this.outsideLine({x:50, y:50},{x:100, y:25}, local)){
					yIso++; // 1 up, right

				}else if(this.outsideLine({x:100, y:25},{x:50, y:0}, local)){
					xIso--; // 1 down, right
				}
				
				return {"x": xIso, "y": yIso}

				

				/*
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
				 


			}
			this.outsideLine = function(a,b,c){
				return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;

			}



			this.render = function(){
				var mouse = this.inputs.mouse.position;
				var client = this.scene;
				var edge_boundry = 50;
				
				
    			
				if(this.inputs.mouse.click){
					this.findTileAt(this.inputs.mouse.click.x, this.inputs.mouse.click.y);
				}


				if(mouse.x < edge_boundry && !(mouse.x < 1)){
					this.viewport.x += 4;
				} 
				if(mouse.x > client.w-edge_boundry && !(mouse.x > client.w-3)){
					this.viewport.x -= 4;
				}
				if(mouse.y < edge_boundry && !(mouse.y < 1)){
					this.viewport.y += 4;
				} 
				if(mouse.y > client.h-edge_boundry && !(mouse.y > client.h-3)){
					this.viewport.y -= 4;
				}

				if(this.viewport.is_dirty()){
					this.world.clear();
					this.renderWorld(this.viewport.x, this.viewport.y);
					this.viewport.clean();
				}

			}

			this.run = function(){
				/*
				
				*/
			}

		};
	}
);