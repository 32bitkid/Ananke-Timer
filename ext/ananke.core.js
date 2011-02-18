window.Ananke = {};

window.Ananke.updateBadge = function(running) {
	chrome.browserAction.setBadgeText({text: (running > 0) ? running.toString() : "" });
}

window.Ananke.options = {
	getPauseOnCreate: function() { return localStorage["Ananke.options.pauseOnCreate"] == "true" },
	setPauseOnCreate: function(val) { localStorage["Ananke.options.pauseOnCreate"] = (val) ? "true" : "false"; }
}

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
		this.items.splice(i,1);
		this.save();	
	},
	stopAll: function(i) {
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

window.Ananke.Item = function(obj) {
	this.name = "";
	this.url = "";
	this.startTime = new Date();
	this.isPaused = false;
	this.pausedTime = 0;
	this.hasLink = false;
	if(obj) {
		for(var i in obj) this[i] = obj[i];
		this.startTime = new Date(this.startTime);
		if(this.isPaused) this.isPaused = new Date(this.isPaused);
		if(this.url) this.hasLink = true;
	}
}

$.extend(window.Ananke.Item.prototype, {
	getElapsed: function() {
		var now = new Date();
		var ms = (now - this.startTime);
		if(this.isPaused) ms -= (now - this.isPaused);
		ms -= this.pausedTime;

		var hours = ms / 1000 / 60 / 60;		
		if (hours > 1) return Math.round(hours*10)/10 + "h";
		var minutes = ms / 1000 / 60;
		if (minutes > 15) return Math.round(minutes/15)*15 + "m";
		if (minutes > 1) return Math.round(minutes) + "m";
		var seconds = ms / 1000;
		return Math.round(seconds) + "s";
	}, 
	pause: function() {
		if(this.isPaused) {
			this.pausedTime += new Date() - this.isPaused;
			this.isPaused = false;
		} else {
			this.isPaused = new Date();
		}
	},
	getStatus: function() {
		var status = []
		if(this.isPaused) status.push("paused");
		return status.join(" ");
	}
})
