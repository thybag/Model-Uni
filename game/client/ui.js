/**
 * UI
 * User Interface Elements for "Model Uni"
 *
 * @package	model-uni
 */
define("game/client/ui.js",
	["//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min.js"],

function () {
	return new function() {
		// Fragments cache to load templates
		var fragments = {};
		var template_fragments = {};

		// Load view file.
		$.get("game/client/ui.html", function(html){
			var fragment = document.createElement('div');
			fragment.innerHTML = html;
			template_fragments = fragment;
		});

		this.showMenu = function(){
			this.createBuildMenu();
		}

		// Show save menu dialog
		this.showSaveMenu = function(){
			var menu = this.getFragment("ui_save_dialog");
			$(menu).modal();
		}

		// Show hire staff dialog
		this.showHireDialog = function(){
			var menu = this.getFragment("ui_hire_staff");
			$(menu).modal();
		}

		
		// Create the build menu
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

		// Get an HTML fragment from template file
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
