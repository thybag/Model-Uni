define("game/client/ui.js",
	["//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js"],
	// content
	function () {
		return new function() {

			var fragments = {};
			var template_fragments = {};

			$.get("game/client/ui.html", function(html){
				var fragment = document.createElement('div');
				fragment.innerHTML = html;
				template_fragments = fragment;

			});

			this.showMenu = function(){
				var mnu = this.getFragment("ui_build_menu");
				mnu.find('a').click(function(){
					//unselect
					mnu.find('li').removeClass('active');
					//reselect
					$(this).parent().addClass('active');

					var tile = $(this).attr('data-tile');

					if(typeof tile != 'undefined') game.client.selected_tile = tile;

				})
				mnu.show();
			}

			this.getFragment = function(name){

				if(typeof fragments[name] === 'undefined'){
					//console.log(template_fragments.getElementById(name));
					//console.log(template_fragments.);
					//console.log(template_fragments.innerHTML);
					itm = $(template_fragments).find('#'+name).css('display','none');
					$(document.body).append(itm);
					fragments[name] = itm;
				}
				return fragments[name];
			}

		}
	});
