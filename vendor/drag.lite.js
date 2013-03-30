// Draggable-lite
// Based on: http://forum.jquery.com/topic/quick-draggable-without-need-for-jqueryui
(function( $ ){
  $.fn.draggable = function( options ) {  
    return this.each(function() {        
		var dragdata = {};
		var mousemove = function (e) {
			game.disable_input = true;
			if (dragdata.down) {
				$(dragdata.el).css({
					"left": e.clientX - dragdata.oX,
					"top": e.clientY - dragdata.oY
				});
			}
		}
		$(this).on({
			mousedown: function (e) {
				if(e.target.className.indexOf('drag-handle') === -1)return false;

				dragdata = {
					"down":true,
					"oX": e.offsetX,
					"oY": e.offsetY,
					"el":this
				};
				$(window).on('mousemove', mousemove);
			},
			mouseup: function () {
				dragdata.down = false;
				$(window).off('mousemove', mousemove);
			}
		});
    });
  };
})( jQuery );