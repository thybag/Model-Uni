define("game/map/map.js",
	// dependencies
	['game/map/map.generator.js'],
	// content
	function (gen) {
		return new function() {

			this.w = 0;
			this.h = 0;
			
			this.map = [];

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



		}
	});