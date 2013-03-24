define("game/sim/people/person.js",[],
// content
function () {
	return new function(){

		this.x = 0;
		this.y = 0;
		this.inner_x = 50;
		this.inner_y = 25;

		this.visable = true;

		this.sprite_type = '';
		this.sprite_instance = '';

		this._init = function(x, y){
			this.x = x;
			this.y = y;
			this.init(x, y);
		}
		// This should be overwritten
		this.tick = function(){

		}


		this.hello = function(){ console.log("hi"); }

		

		this.route = function(){}

		this.currentTile = function(){
			return {"x": this.x, "y": this.y};
		}
		this.positionInTile = function(){
			return {"x": this.inner_x-2, "y": this.inner_y - 13};
		}
	}
});