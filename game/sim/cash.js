define("game/sim/cash.js",[],
// content
function () {
	return new function(){


		this.total = 100000;

		this.spend = function(amount){
			this.total -= amount;
		}
		this.gain = function(amount){
			this.total += amount;
		}


		this.incoming = {
			'campus_outlets': 0, // Shop income
			'student_feeds':0, // 9k per student?
			'total':0
		}
		this.outgoing = {
			'building_maintenance':0, // upkeep costs
			'utilities':0,	//powering costs
			'staff_pay':0, // fast costs
			'total':0
		}
	}
});