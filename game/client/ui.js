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
				this.createBuildMenu();


				/*
				mnu.find('a').click(function(){
					//unselect
					mnu.find('li').removeClass('active');
					//reselect
					$(this).parent().addClass('active');

					var tile = $(this).attr('data-tile');

					if(typeof tile != 'undefined') game.client.selected_tile = tile;

				})
				mnu.show();*/
			}

			this.createBuildMenu = function(){
				var menu = this.getFragment("ui_build_menu");
				menu.find(".slidedown-submenu>a").click(function(){
					$(this).parent().children(".slidedown-menu").slideToggle();
				});

				var options = menu.find('.slidedown-menu a, .action a');

				options.click(function(){

					var tile = $(this).attr('data-tile');

					if(typeof tile !== 'undefined'){
						options.parent().removeClass('active');
						$(this).parent().addClass('active');

						game.client.selected_tile = tile;
					}
				});

				menu.show();
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
