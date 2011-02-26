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
