$(document).ready(function() {
	var core = "History - "

	module(core + "Instance Methods", {
		setup: function() {
			this.obj = { k: "" }
			this.key = "k"
			this.historyRepo = new Ananke.HistoryRespository(this.obj, this.key);
		}
	});

	test("should be able to archive an item on a day", function() {
		var i = new Ananke.Item();
		this.historyRepo.add(i);
		var items = this.historyRepo.getFrom(new Date());
		deepEqual(items, [i]);
	})

	test("should be able to archive multiple items", function() {
		var items = [new Ananke.Item(),  new Ananke.Item()]
		this.historyRepo.add.apply(this.historyRepo, items)
		var returnedItems = this.historyRepo.getFrom(new Date())
		deepEqual(returnedItems, items)
	})

	test("should JSONify on add", function() {
		var before = this.obj[this.key]

		var i = new Ananke.Item();
		this.historyRepo.add(i);
		
		var after = this.obj[this.key]

		notEqual(before, after)
	})

	test("should be able to archive multiple items on different days", function() {
		var a = new Ananke.Item({startTime: new Date(90,1,1) });
		var b = new Ananke.Item({startTime: new Date(90,1,2) });
		var items = [a,b]
		
		this.historyRepo.add.apply(this.historyRepo, items)
		var returnedItems = this.historyRepo.getFrom(new Date(90,1,1))
		deepEqual(returnedItems, [a]);

		returnedItems = this.historyRepo.getFrom(new Date(90,1,2))
		deepEqual(returnedItems, [b]);
	})

	test("get available dates", function() {
		var a = new Ananke.Item({startTime: new Date(90,1,1) });
		var b = new Ananke.Item({startTime: new Date(88,1,2) });
		var items = [b,a]
		
		this.historyRepo.add.apply(this.historyRepo, items)
		var returnedItems = this.historyRepo.getFrom(new Date(90,1,1))
		deepEqual(returnedItems, [a]);

		var dates = this.historyRepo.availableDates()
		
		deepEqual(JSON.stringify(dates), JSON.stringify([new Date(90,1,1), new Date(88,1,2)]));
	})

	module("Bugs")

	test("should be able to parse a simple history", function() {
		var history = '{"Sun Feb 27 2011":[{"name":"History","url":"chrome-extension://ajglfejoilfacenhngdbihggihpfijhc/history.html","startTime":"2011-02-27T19:43:57.129Z","isPaused":false,"isStopped":"2011-02-27T19:43:59.699Z","pausedTime":0,"hasLink":true}]}'
		var obj = { history: history }
		var historyRepo = new Ananke.HistoryRespository(obj, "history");

		var dates = historyRepo.availableDates();
		deepEqual(dates, [new Date(2011, 1, 27)]);

		var items = historyRepo.getFrom(new Date(2011, 1, 27));
		equal(items.length, 1);
	})
})