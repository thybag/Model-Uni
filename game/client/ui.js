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
		this.student_count = null;
		this.staff_count = null;
		this.debug = null;

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
				this.cash.text(game.sim.data.cash);
				this.student_count.text(game.sim.data.student_population);
				this.staff_count.text(game.sim.data.staff_population);
				ticker_internal = 0;

				this.debug.text(game.ticker.fps);
			}
		}

		this.showMenu = function(){
			this.createBuildMenu();
			this.addMenuListener($(".game-ui"));
		}

		this.addMenuListener = function(ele){
			ele.hover(function(){
					game.disable_input = true;
			},function(){
					game.disable_input = false;
			});
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

		// Show hire staff dialog
		this.showInfoDialog = function(info){
			var dlg = this.getFragment("ui_info_dialog");

			$(dlg).find('.contents').text(JSON.stringify(info));
			$(dlg).modal({"backdrop":false});
		}
		// Show hire staff dialog
		this.showRoomInfoDialog = function(info){
			var dlg = this.getFragment("ui_room_info_dialog");
			content = this.getContent("ui_room_info_dialog_content");
			raw = this.tpl(content, info);
			console.log(info);
			$(dlg).html(raw );
			$(dlg).modal({"backdrop":false});
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
			this.student_count = menu.find('#ui-student-population-box');
			this.staff_count = menu.find('#ui-staff-population-box');

			this.debug = $("#debug_fps");
		}

		//https://github.com/thybag/base.js/blob/master/template.js
		this.tpl = function(template_string, data, prefix){
			//Foreach data value
			for(var i in data){
				//Used for higher depth items
				var accessor = i;
				if(typeof prefix !== 'undefined') i = prefix+'.'+i
				//If object, recusivly call self, else template value.
				if(typeof data[i] === 'object'){
					template_string = this.tpl(template_string, data[i], i);
				}else{
					template_string = template_string.replace(new RegExp('{'+i+'}','g'), data[accessor]);
				}
			}
			//return templated HTML
			return template_string;
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

			this.addMenuListener(fragments[name]);
			return fragments[name];
		}
		this.getContent = function(name){
			itm = $(template_fragments).find('#'+name);
			return itm.html();
		}

	}
});
