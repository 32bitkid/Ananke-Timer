window.Ananke = (window.Ananke) ? window.Ananke : {}
window.Ananke.Item = function(obj) {
	this.name = "";
	this.url = "";
	this.startTime = new Date();
	this.isPaused = false;
	this.isStopped = false;
	this.pausedTime = 0;
	this.hasLink = false;
	if(obj) {
		for(var i in obj) this[i] = obj[i];
		this.startTime = new Date(this.startTime);
		if(this.isPaused) this.isPaused = new Date(this.isPaused);
		if(this.isStopped) this.isStopped = new Date(this.isStopped);
		if(this.url) this.hasLink = true;
	}
}

window.Ananke.Item.msToHumanTime = function(ms) {
	var hours = ms / 1000 / 60 / 60;
	if (hours > 1) return Math.round(hours*10)/10 + "h";
	var minutes = ms / 1000 / 60;
	if (minutes > 15) return Math.round(minutes/15)*15 + "m";
	if (minutes > 1) return Math.round(minutes) + "m";
	var seconds = ms / 1000;
	return Math.round(seconds) + "s";
}

$.extend(window.Ananke.Item.prototype, {
	getElapsed: function() {
		var end = (this.isStopped) ? this.isStopped : new Date();
		var ms = (end - this.startTime);
		if(this.isPaused) ms -= (end - this.isPaused);
		ms -= this.pausedTime;

		return ms;
	},
	getHumanElapsed: function() {
		var ms = this.getElapsed();
		return this.constructor.msToHumanTime(ms);
	},
	getBreakTime: function() {
		return this.constructor.msToHumanTime(this.pausedTime);
	},
	pause: function() {
		if(this.isPaused) {
			this.pausedTime += new Date() - this.isPaused;
			this.isPaused = false;
		} else {
			this.isPaused = new Date();
		}
	},
	stop: function() {
		if(this.isPaused) {
			this.isStopped = this.isPaused
			this.isPaused = false;	
		} else {
			this.isStopped = new Date();
		}
	},
	getStatus: function() {
		var status = []
		if(this.isPaused) status.push("paused");
		if(this.isStopped) status.push("stopped");
		return status.join(" ");
	}
})