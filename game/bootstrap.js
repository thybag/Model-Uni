// Make public scope "game"
var game;
// Load libary and "game"
require(["./vendor/spritejs/sprite.js","./game/game.js", "./vendor/store.js"], function(spr, game, store) {
	// Make "store" public
	window.store = store;

	// Setup sprite.js and create layers
	var scene = sjs.Scene({'useWebGL':false ,'w': window.innerWidth, 'h':  window.innerHeight-42});

	// Load images
	scene.loadImages([
		"assets/tiles/grass.png",
		"assets/tiles/grass_wtree.png",

		"assets/tiles/lotW.png",
		"assets/tiles/lotE.png",
		// basic
		"assets/tiles/road.png",
		"assets/tiles/road_end.png",
		// straight
		"assets/tiles/roadEW.png",
		"assets/tiles/roadNS.png",
		// ends
		"assets/tiles/endN.png",
		"assets/tiles/endE.png",
		"assets/tiles/endS.png",
		"assets/tiles/endW.png",
		// corners
		"assets/tiles/roadES.png",
		"assets/tiles/roadNE.png",
		"assets/tiles/roadNW.png",
		"assets/tiles/roadSW.png",
		// 3 way joins
		"assets/tiles/crossroadESW.png",
		"assets/tiles/crossroadNES.png",
		"assets/tiles/crossroadNEW.png",
		"assets/tiles/crossroadNSW.png",
		"assets/tiles/crossroadNSW.png",
		// crossroad
		"assets/tiles/crossroad.png",
	], 
	function() {
			// Provide game with "world" objects
			game.scene = scene;
			game.__construct();

			// Start game loop
			var ticker = scene.Ticker(function() {
				game.tick(); 
			});
			ticker.run();
			// Give game access to ticker
			game.ticker = ticker;
		});
});
