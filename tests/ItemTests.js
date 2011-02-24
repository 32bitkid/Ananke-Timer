$(document).ready(function() {
	core = "Item &mdash; "

	module(core + "Static Template Helpers");

	test("msToHumanTime", function() {
		var f = Ananke.Item.msToHumanTime;
		equal(f(1000), "1s");
		equal(f(60000), "60s");
		equal(f(80000), "1m");
		equal(f(110000), "2m");
		equal(f(1000*60*14), "14m");
		equal(f(1000*60*15), "15m");
		equal(f(1000*60*16), "15m");
		equal(f(1000*60*28), "30m");
		equal(f(1000*60*60), "60m");
		equal(f(1000*60*61), "1h");
		equal(f(1000*60*90), "1.5h");
	});

	module(core + "Instance Methods");

	test("pause()", function() {
		var i = new Ananke.Item();
		i.pause();
		ok(i.isPaused);
		ok(!i.isStopped);
		equal(i.getStatus(), "paused");
	});

	test("stop()", function() {
		var i = new Ananke.Item();
		i.pause();
		i.stop();
		ok(!i.isPaused);
		ok(i.isStopped);
		equal(i.getStatus(), "stopped");
	});

})