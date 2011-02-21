$(document).ready(function() {
	core = "Timer Controller Tests &mdash; "

	module(core + "Static Template Helpers");

	test("getSafeName should return the full name if it is less that 30 character", function() {
		var funct = Ananke.TimerController.templateHelpers.getSafeName;
		var self = { data: {name: "Test" } };
		var ret = funct.call(self);
		equal(ret, "Test");
	});

	test("getSafeName should return a shortened name if it is more that 30 character", function() {
		var funct = Ananke.TimerController.templateHelpers.getSafeName;
		var self = { data: {name: "12345678901234567890123456789012345" } };
		var ret = funct.call(self);
		equal(ret, "123456789012345678901234567...");
	});

	test("getSafeName should return the status of the data element", function() {
		expect(1);
		var funct = Ananke.TimerController.templateHelpers.getStatus;
		var self = { data: {getStatus: function() { ok(true); } } };
		funct.call(self);
	});

	module(core + "Static Strings")
	test("emptyNameText", function() {
		equals(Ananke.TimerController.emptyNameText, "[Timer Name]");
	})
	test("emptyURLText", function() {
		equals(Ananke.TimerController.emptyURLText, "[URL]");
	})
})