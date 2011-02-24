window.Ananke = {};

window.Ananke.initBadge = function() {
	var model = new window.Ananke.ItemsRepository("Ananke.items");
	var running = 0;
	for(var i = 0; i < model.items.length; i++) {
		var item = model.items[i];
		if (item.isPaused == false) running++;
	}

	window.Ananke.updateBadge(running);
}

window.Ananke.updateBadge = function(running) {
	var s = Ananke.options.getBadgeSetting();
	switch(s) {
		case Ananke.options.badgeSettings.showCurrentlyRunning:
			chrome.browserAction.setBadgeText({text: (running > 0) ? running.toString() : "" });
			break;
		case Ananke.options.badgeSettings.showOnNoneRunning:
			chrome.browserAction.setBadgeText({text: (running == 0) ? running.toString() : "" });
			break;
		default:
			chrome.browserAction.setBadgeText({text:""});
	}
}

window.Ananke.options = {
	getPauseOnCreate: function() { return localStorage["Ananke.options.pauseOnCreate"] == "true" },
	setPauseOnCreate: function(val) { localStorage["Ananke.options.pauseOnCreate"] = (val) ? "true" : "false"; },
	getBadgeSetting: function() { return localStorage["Ananke.options.badgeSetting"]; },
	setBadgeSetting: function(val) { localStorage["Ananke.options.badgeSetting"] = val; },
	getLinkType: function() { return localStorage["Ananke.options.linkType"]; },
	setLinkType: function(val) { localStorage["Ananke.options.linkType"] = val; }
}

window.Ananke.options.badgeSettings = { hidden: "0", showCurrentlyRunning: "1", showOnNoneRunning: "2" }

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
