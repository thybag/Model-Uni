var test;
define("game/simulation.js",
	// dependencies
	[],
	// content
	function () {
		return new function() {

			this.viewport = new function() {
				this.x = 500;
				this._x = this.x;
				this.y = -500;
				this._y = this.y;
				this.is_dirty = function(){ return !(this.y == this._y && this.x == this._x)};
				this.clean = function(){ this._y = this.y; this._x = this.x; };
			}

			// actors (live stuff)
			this.entities = [];

			// world
			this.tiles = {};

			//debug
			here = this;

			// Define world
			var map_x = 50;
			var map_y = 50;
			var map = [];

			var r_x = 0;
			var r_y = 0;
			for(var y=0; y<map_y;y++){
				for(var x=0; x<map_x;x++){
					if(typeof map[y] === 'undefined')map[y]=[];

					if(y == r_y || x == r_x){//
						//r_y += (x % 2) ? 1 : 0;
						//r_x += 1;// 0 : 2;
						map[y][x] = "road";
					}else{

						if(Math.floor((Math.random()*50)+1) == 10){
							map[y][x] = "trees";
						}else{
							map[y][x] = "grass";
						}
						
					}

					
				}
			}

			var tile_prop = {"w":100, "h":50, "hw": 50, "hh": 25};

			this.__construct = function(){

				// inputs
				this.inputs = this.scene.Input();

				// populate tiles
				this.tiles = {
					"grass": this.scene.Sprite('assets/tiles/grass.png', { "layer": this.world }).scale(0.6),
					"trees": this.scene.Sprite('assets/tiles/grass_wtree.png', { "layer": this.world }),
					"road": this.scene.Sprite('assets/tiles/road.png', { "layer": this.world })
				}
	
				//this.tiles.get('assets/tiles/grass.png');
				this.renderWorld(this.viewport.x,this.viewport.y);

				// make scalable


				this.world._scale = 1;
				document.addEventListener('mousewheel', function(e){
					if(e.wheelDelta > 0){
						//in
						here.world._scale += 0.1;
						here.scaleWorld(here.world._scale);
					}else{
						here.world._scale -= 0.1;
						// out
						here.scaleWorld(here.world._scale);
					}

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

			this.renderWorld = function(offset_x,offset_y){
				

				var tile_x = offset_x;
				var tile_y = offset_y;

				for (var y = 0; y < map_y; y++) {
					for (var x = 0; x < map_x; x++) {
						this.tiles[map[y][x]].position(tile_x, tile_y-(this.tiles[map[y][x]].h % 65)).canvasUpdate(this.world);
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



			this.render = function(){
				var mouse = this.inputs.mouse.position;
				var client = this.scene;
				var edge_boundry = 50;
				//console.log(mouse.x );
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