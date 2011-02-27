window.Ananke = (window.Ananke) ? window.Ananke : {}

//  Ananke Items
window.Ananke.ItemsRepository = function(obj, key) {
	this.obj = obj;
	this.key = key;
	this.update();
}

$.extend(window.Ananke.ItemsRepository.prototype, {
	update: function() {
		var rawItems = this.obj[this.key]
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
		var deletedItem = this.items.splice(i,1);
		this.save();
		return deletedItem;
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
		this.obj[this.key] = raw;
		return raw;
	},
	clearAllItems: function() {
		this.items = []
		this.save();
	}
});

//  Ananke History
window.Ananke.HistoryRespository = function(obj, key) {
	this.obj = obj;
	this.key = key;
	this.update();
}

$.extend(Number.prototype, {
	zeroPad: function(length) {
		var zp = this.toString() + '';
		while(zp.length < length) zp = "0" + zp;
		return zp
	}
})

$.extend(Date.prototype, {
	toKey: function() {
		return this.getFullYear().toString() + this.getMonth().zeroPad(2) + this.getDate().zeroPad(2);
	}
})

$.extend(window.Ananke.HistoryRespository.prototype, {
	repo: function() {
		return this.obj[key];
	},
	update: function() {
		var rawItems = this.obj[this.key]
		this.history = {};
		if(rawItems) {
			var history = JSON.parse(rawItems);
			for(var date in history)
				for(var item in date) {
					if(!this.history[date]) this.history[date] = [];
					this.history[date][item] = new window.Ananke.Item(history[date][item]);
				}
		}
	},
	save: function() {
		var raw = JSON.stringify(this.history);
		this.obj[this.key] = raw;
	},
	add: function() {
		for(var i = 0; i < arguments.length; i++) {
			var item = arguments[i];
			var target = this.history[item.startTime.toKey()]
			if(!target) target = this.history[item.startTime.toKey()] = []

			target.push(arguments[i]);
		}
		this.save();
	},
	getFrom: function(date) {
		return this.history[date.toKey()];
	}
})