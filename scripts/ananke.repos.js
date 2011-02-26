window.Ananke = (window.Ananke) ? window.Ananke : {}

//  Ananke Items
window.Ananke.ItemsRepository = function(repo) {
	this.repo = repo;
	this.update();
}

$.extend(window.Ananke.ItemsRepository.prototype, {
	update: function() {
		var rawItems = localStorage[this.repo]
		this.items = [];
		if(rawItems) {
			var items = JSON.parse(rawItems);
			for(var i in items) {
				this.items[i] = new window.Ananke.Item(items[i]);
			}
		}
	},
	getItem: function(i) {
		return this.items[i];
	},
	appendItem: function(newItem) {
		this.items.push(newItem);
		this.save();
	},
	stopItem: function(i) {
		this.items[i].stop()
		this.save();
	},
	deleteItem: function(i) {
		this.items.splice(i,1);
		this.save();
	},
	deleteAll: function(i) {
		this.items = []
		this.save();
	},
	pauseItem: function(i) {
		this.items[i].pause();
		this.save();
	},
	pauseAll: function() {
		for(var i in this.items) {
			if(this.items[i].isPaused == false) {
				this.items[i].pause();
			}
		}
		this.save();
	},
	save: function() {
		var raw = JSON.stringify(this.items);
		localStorage[this.repo] = raw;
		return raw;
	},
	clearAllItems: function() {
		this.items = []
		this.save();
	}
});