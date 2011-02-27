$(document).ready(function() {
	core = "Timer Controller Tests -"

	module(core + "Static Template Helpers");

	test("getSafeName should return the full name if it is less that 30 character", function() {
		var funct = Ananke.TimerController.templateHelpers.getSafeName;
		var self = { data: {name: "Test" } };
		var ret = funct.call(self);
		equal(ret, "Test", "Got the correct name");
	});

	test("getSafeName should return a shortened name if it is more that 30 character", function() {
		var funct = Ananke.TimerController.templateHelpers.getSafeName;
		var self = { data: {name: "12345678901234567890123456789012345" } };
		var ret = funct.call(self);
		equal(ret, "123456789012345678901234567...", "Got the correct name");
	});

	test("getSafeName should return the status of the data element", function() {
		expect(1);
		var funct = Ananke.TimerController.templateHelpers.getStatus;
		var self = { data: {getStatus: function() { ok(true, "the data object's getStatus() called"); } } };
		funct.call(self);
	});

	module(core + "Static Strings")
	test("Static Strings", function() {
		equals(Ananke.TimerController.emptyNameText, "[Timer Name]", "emptyNameText is correct");
		equals(Ananke.TimerController.emptyURLText, "[URL]", "emptyURLText is correct");
	})

	module(core + "Testing Buttons", {
		setup: function() {
			this.defaultConfig = {
				model: { items: [] },
				taskTemplate: $("<tr><td>template</td></tr>"),
				taskLink: $("<input name='link' type='radio' value='none'><input name='link' type='radio' value='current'><input name='link' type='radio' value='manual'>"),
				stopIcons: $("<div>"),
				pauseIcons: $("<div>"),
				deleteIcons: $("<div>"),
				linkIcons: $("<div>"),
				table: $("<table>"),
				pauseAllButton: $("<div>"),
				deleteAllButton: $("<div>"),
				historyButton: $("<div>"),
				totalTime: $("div"),
				taskName: $("<input>"),
				taskURL: $("<input>"),
				newTaskForm: $("<form>"),
				itemClass: function() {},
				anankeOptions: {
					getLinkType: function() {},
					setLinkType: function() {},
					getPauseOnCreate: function() {}
				}

			}
			this.defaultConfig.itemClass.msToHumanTime = function() {}
		}
	})

	test("I want to pause all my timers", function() {
		expect(1);
		this.defaultConfig.model.pauseAll = function() { ok(true, "model.pauseAll called"); }
		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.pauseAllButton.click();
		controller.teardown();
	})

	test("I want to delete all timers", function() {
		// Override confirm
		var oldConfirm = confirm;
		confirm = function() { ok(true, "Cofirm popup.");  return true; }

		expect(2);

		this.defaultConfig.model.stopAll = function() { ok(true, "model.stopAll called"); }
		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.deleteAllButton.click();
		controller.teardown();

		// Restore Confirm
		confirm = oldConfirm;
	})

	test("I accidentally click to delete all timers", function() {
		// Override confirm
		var oldConfirm = confirm;
		confirm = function() { ok(true, "Cofirm popup.");  return false; }

		expect(1);

		this.defaultConfig.model.stopAll = function() { ok(false, "model.stopAll should not be called"); }
		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.deleteAllButton.click();
		controller.teardown();

		// Restore Confirm
		confirm = oldConfirm;
	})

	test("I want to create a new unlinked timer", function() {
		expect(4)

		this.defaultConfig.taskName.focus(function() { ok(false, "Should not have gotten focus"); })

		this.defaultConfig.itemClass = function(obj) {
			ok(true, "Created a new item")
			equals(obj.name, "Test", "Name correctly set")
			equals(obj.url, "", "URL is blank")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(true, "Appending a new item");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskLink.filter("[value='none']").click();
		this.defaultConfig.taskName.val("Test").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("I have forgotten to put in a name in an unlinked timer", function() {
		expect(1);
		this.defaultConfig.taskName.focus(function() {
			ok(true, "Task Name got focus");
		});

		this.defaultConfig.itemClass = function(obj) {
			ok(false, "A new Item should not be created")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(false, "Nothing should be appended");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskLink.filter("[value='none']").click();
		this.defaultConfig.taskName.val("").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("I want to create a linked timer", function() {
		expect(4);

		this.defaultConfig.taskName.focus(function() {
			ok(false, "Task Name should not have gotten focus");
		});

		this.defaultConfig.itemClass = function(obj) {
			ok(true, "Created a new item")
			equals(obj.name, "Google", "Name is correct")
			equals(obj.url, "http://google.com", "URL is correct")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(true, "Nothing should be appended");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskName.val("Google").blur();
		this.defaultConfig.taskLink.filter("[value='current']").click();
		this.defaultConfig.taskURL.val("http://google.com").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("I want to create a manual timer without a link", function() {
		expect(1);

		this.defaultConfig.taskURL.focus(function() {
			ok(true, "Task URL should have focus");
		});

		this.defaultConfig.itemClass = function(obj) {
			ok(false, "No item should be created")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(false, "No timer should be appended");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskLink.filter("[value='manual']").click();
		this.defaultConfig.taskName.val("Google").blur();
		this.defaultConfig.taskURL.val("").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("I want to create a manual timer with a bad link", function() {
		expect(1);

		this.defaultConfig.taskURL.focus(function() {
			ok(true, "Task URL should have focus");
		});

		this.defaultConfig.itemClass = function(obj) {
			ok(false, "No item should be created")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(false, "No timer should be appended");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskLink.filter("[value='manual']").click();
		this.defaultConfig.taskName.val("Google").blur();
		this.defaultConfig.taskURL.val("garbage").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("I want to create a manual timer", function() {
		expect(4);

		this.defaultConfig.taskURL.focus(function() {
			ok(false, "Task URL should not have focus");
		});

		this.defaultConfig.itemClass = function(obj) {
			ok(true, "Created a new item")
			equals(obj.name, "Google", "Name is correct")
			equals(obj.url, "http://google.com", "URL is correct")
		}
		this.defaultConfig.itemClass.msToHumanTime = function() {};

		this.defaultConfig.model.appendItem = function(timer) {
			ok(true, "A timer should be appended");
		}

		var controller = new Ananke.TimerController(this.defaultConfig);
		this.defaultConfig.taskLink.filter("[value='manual']").click();
		this.defaultConfig.taskName.val("Google").blur();
		this.defaultConfig.taskURL.val("http://google.com").blur();
		this.defaultConfig.newTaskForm.submit();
		controller.teardown();
	})

	test("Delete a timer", function() {
		expect(8);

		$("#qunit-fixture").append("<tr data-item-index='0'><td><div></div></td></tr>")

		var item = {id:"testobject"};
		
		this.defaultConfig.model.items = [item]
		this.defaultConfig.deleteIcons = $("#qunit-fixture div")
		this.defaultConfig.model.deleteItem = function(index) {
			ok(true, "delete called")
			equal(index, "0");
			this.items = []
			return [item]
		}
		this.defaultConfig.historyRepo = {
			add: function() { 
				ok(true, "Assert Called")
				deepEqual(arguments[0], item)
			},
		}
		
		var c = new Ananke.TimerController(this.defaultConfig);
		var rows = 0

		rows = this.defaultConfig.table.children().length
		equal(rows, 1);
		equal(this.defaultConfig.table.text(), "template")
		this.defaultConfig.deleteIcons.click();
		rows = this.defaultConfig.table.children().length
		equal(rows, 1);
		equal(this.defaultConfig.table.text(), "None")
	})
})