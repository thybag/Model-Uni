define("game/client/viewport.js",[],
	// content
	function () {
		return new function() {
			// x / y of user viewport
			this.x = 500;
			this._x = this.x;
			this.y = 200;
			this._y = this.y;

			// currently slected tile
			this.selected_tile = {x:0, y :0}

			// current viewport scale
			this.scale = 1;

			// is viewport currently dirty?
			this.dirty = false;

			// Is dirty (x/y have been changed or dirty set?)
			this.is_dirty = function(){
			 	return !(this.y == this._y && this.x == this._x && !this.dirty)
			}
			// make viewport clean again
			this.clean = function(){
			 	this._y = this.y; this._x = this.x; this.dirty=false;
			}
		}
	});