require(["./vendor/spritejs/sprite.js","./game/simulation.js"], function(spr, sim) {

	var scene = sjs.Scene({'useWebGL':false ,'w': window.innerWidth, 'h':  window.innerHeight});
	var world = scene.Layer("world",  {"useCanvas":true, "autoClear":false});
	//var overlay = scene.Layer("overlay");

	scene.loadImages([
		"assets/tiles/grass.png",
		"assets/tiles/grass_wtree.png",
		"assets/tiles/road.png",
		"assets/tiles/roadEW.png",
		"assets/tiles/roadNS.png"
	], 
	function() {
			// Provide scene
			sim.scene = scene;
			sim.world = world;
			sim.__construct();

			// Start game loop
			var ticker = scene.Ticker(function() {
				sim.tick(); 
			}).run();

			sim.ticker = ticker;
		});
});
