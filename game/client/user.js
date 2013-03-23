/**
 * User
 *
 * Eventually responcible for input handling (maybe?)
 * Holds currently selected type etc
 *
 * @package	model-uni
 */

define("game/client/user.js",[],
	// content
function () {
	return new function() {
		this.selected = 'road';
		this.selection_type = 'tile';
	}
});