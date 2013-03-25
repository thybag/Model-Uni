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
		var ticker_internal = 100;

		//ref
		this.mainMenu = null;
		this.date = null;
		this.cash = null;

		// Load view file.
		$.get("game/client/ui.html", function(html){
			var fragment = document.createElement('div');
			fragment.innerHTML = html;
			template_fragments = fragment;
		});



		this.tick = function(){
			ticker_internal++;
			if(ticker_internal > 40){

				var dt = game.sim.getGameDate();

				this.date.text(dt.hour + ':' +dt.min + ' - ' + dt.day + ' ' + dt.month + ' ' +dt.year);

				ticker_internal = 0;
			}
		}

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
				var building = $(this).attr('data-building');
				var demolish = $(this).attr('data-demolish');
				// Select a tile
				if(typeof tile !== 'undefined'){
					options.parent().removeClass('active');
					$(this).parent().addClass('active');

					game.user.selection_type = 'tile';
					game.user.selected = tile;
				}
				// Select a building
				else if(typeof building !== 'undefined'){
					options.parent().removeClass('active');
					$(this).parent().addClass('active');

					game.user.selection_type = 'building';
					game.user.selected = building;
				}else if(typeof demolish !== 'undefined'){

					options.parent().removeClass('active');
					$(this).parent().addClass('active');
					// demolish mode!
					game.user.selection_type = 'demolish';
					game.user.selected = "grass";
				}
			});
			menu.show();

			this.mainMenu = menu;
			this.date = menu.find('#ui-date-box');
			this.cash = menu.find('#ui-cash-box');
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
