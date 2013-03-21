define("game/client/viewport.js",[],
	// content
	function () {
		return new function() {

			this.x = 500;
			this._x = this.x;
			this.y = 200;
			this._y = this.y;

			this.selected_tile = {x:0, y :0}
			this.scale = 1;
			this.dirty = false;

			this.is_dirty = function(){
			 	return !(this.y == this._y && this.x == this._x && !this.dirty)
			};
			this.clean = function(){
			 	this._y = this.y; this._x = this.x; this.dirty=false;
			};
		}
	});