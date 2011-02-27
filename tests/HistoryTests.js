$(document).ready(function() {
	
	module("")
	test("date.toKey()", function() {
		var key;

		key = new Date(2010,1,1).toKey();
		equals(key, "20100101")
	})

	test("Number.zeroPad()", function() {
		equals((1).zeroPad(2), "01")
	})

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
})