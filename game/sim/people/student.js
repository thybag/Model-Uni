define("game/sim/people/student.js",
	["game/sim/people/person.js"],
// content
function (person) {
	console.log("...");
	var Student = function(){
		// Set person as parent
	};
	Student.prototype = person;
	return Student;
});