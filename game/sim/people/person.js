define("game/sim/people/person.js",[],
// content
function () {
	return new function(){

		this.x = 0;
		this.y = 0;
		this.y_offset = -13;
		this.x_offset = -2;
		this.visable = true;

		this.sprite_type = '';
		this.sprite_instance = '';

		this._init = function(x, y){
			this.x = x;
			this.y = y;

			this.inner_y = (this.rand(2)==1) ? 28 : 22;
			this.inner_x = (this.rand(2)==1) ? 55 : 45;


			this.init(x, y);
		}




		// This should be overwritten
		this.tick = function(){

		}



		// Thoughts
		this.complaints = [];
		this.compliments = [];
		this.complain = function(complain){
			this.complaints.push(complain);
		}
		this.compliment = function(compliment){
			this.compliments.push(compliment);
		}


		this.currentTile = function(){
			return {"x": this.x, "y": this.y};
		}

		// between 1 & top
		this.rand = function(top){

			return Math.floor((Math.random()*top))+1;
		}
	}
});