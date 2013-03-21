define("game/map/map.generator.js",
	// dependencies
	[],
	// content
	function () {
		return new function() {

			// Generate basic map
			this.createMap = function(w,h){
				map = [];


				for(var y=0; y<h;y++){
					for(var x=0; x<w;x++){
						if(typeof map[y] === 'undefined')map[y]=[];

						
							if(Math.floor((Math.random()*50)+1) == 10){
								map[y][x] = "trees";
							}else{
								map[y][x] = "grass";
							}
						
					}
				}


				for(var y=0; y<h;y++){
					map[1][y] = "lot_e";	
					map[2][y] = "lot_w";	
				}
				
				return map;
			}


		}
	});