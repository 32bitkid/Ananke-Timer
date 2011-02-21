window.Ananke = (window.Ananke) ? window.Ananke : {}
window.Ananke.TimerController = function(config) {
	this.config = config;

	this.model = this.config.model;
	this.newTaskForm = this.config.newTaskForm;
	this.taskLink = this.config.taskLink;
	this.taskName = this.config.taskName;
	this.taskURL = this.config.taskURL;
	this.table = this.config.table;
	this.totalTime = this.config.totalTime;
	this.taskTemplate = this.config.taskTemplate;
	this.anankeOptions = this.config.anankeOptions;
	this.itemClass = this.config.itemClass;

	var linkSetting = this.anankeOptions.getLinkType();
	this.taskLink.filter("*[value='"+linkSetting+"']").click();

	this.config.stopIcons.live("click", jQuery.proxy(this.handleStop, this));
	this.config.pauseIcons.live("click", jQuery.proxy(this.handlePause, this));
	this.config.linkIcons.live("click", jQuery.proxy(this.handleLink, this));
	this.table.find("tr").live("mouseover", function() { $(this).addClass("over"); }).live("mouseout", function() { $(this).removeClass("over"); });

	this.config.pauseAllButton.click(jQuery.proxy(this.pauseAll, this));
	this.config.deleteAllButton.click(jQuery.proxy(this.deleteAll, this));

	this.taskLink
		.click(jQuery.proxy(this.updateForm, this));


	this.taskName
		.blur(jQuery.proxy(this.taskNameUpdate, this))
		.focus(jQuery.proxy(this.taskNameFocused, this));

	this.taskURL
		.blur(jQuery.proxy(this.taskURLUpdate, this))
		.focus(jQuery.proxy(this.taskURLFocused, this));

	this.newTaskForm.submit(jQuery.proxy(this.createNewTask, this));

	this.updateForm();
	this.updateTable();

	this.interval = setInterval(jQuery.proxy(this.updateTimes, this), 1000);
}

window.Ananke.TimerController.templateHelpers = {
	getSafeName: function() {
		return (this.data.name.length < 30) ? this.data.name : this.data.name.substr(0,27).trim() + "..."
	},
	getStatus: function() {
		return this.data.getStatus();
	}
}

window.Ananke.TimerController.emptyNameText = "[Timer Name]"
window.Ananke.TimerController.emptyURLText = "[URL]"

$.extend(window.Ananke.TimerController.prototype, {
	teardown: function() {
		clearInterval(this.interval);	
	},
	handleLink: function(e) {
		var index = $(e.currentTarget).closest("tr").attr("data-item-index");
		var item = this.model.getItem(index);
		chrome.tabs.create({url: item.url});
	},
	handleStop: function(e) {
		var index = $(e.currentTarget).closest("tr").attr("data-item-index");
		this.model.stopItem(index);
		this.updateTable();
	},
	handlePause: function(e) {
		var index = $(e.currentTarget).closest("tr").attr("data-item-index");
		this.model.pauseItem(index);
		this.updateTable();
	},
	pauseAll: function() {
		this.model.pauseAll();
		this.updateTable();
	},
	deleteAll: function() {
		var response = confirm("Are you sure you want to delete all timers?");
		if(!response) return;
		this.model.stopAll();
		this.updateTable();
	},
	getLinkSetting: function() {
		return this.taskLink.filter("*:checked").val();
	},
	createNewTask: function(e){
		if(this.taskName.hasClass("empty"))
		{
			this.taskName.focus();
			return false;
		}

		if(this.getLinkSetting() == "manual"
			&& (this.taskURL.hasClass("empty")
				|| !(/^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/ix).test(this.taskURL.val())))
		{
			this.taskURL.focus();
			return false;
		}

		if(this.anankeOptions.getPauseOnCreate()) this.model.pauseAll();

		this.model.appendItem(new this.itemClass({
			name: this.taskName.val(),
			url: this.taskURL.val()
		}))

		this.updateTable();
		return false;
	},
	handleGetSelected: function(tab) {
		this.taskName.val(tab.title).removeClass("empty").attr("readonly", "readonly");
		this.taskURL.val(tab.url).removeClass("empty").attr("readonly", "readonly");
	},
	updateForm: function(e) {
		var setting = this.getLinkSetting();
		switch(setting) {
			case "current":
			chrome.tabs.getSelected(null, jQuery.proxy(this.handleGetSelected, this));
			this.taskURL.val("").filter(":visible").hide(e ? "blind" : undefined);
			break;
			case "none":
			this.taskName.val("").blur().removeAttr("readonly");
			this.taskURL.val("").filter(":visible").hide(e ? "blind" : undefined);
			break;
			case "manual":
			this.taskName.val("").blur().removeAttr("readonly");
			this.taskURL.val("").blur().removeAttr("readonly").filter(":hidden").show(e ? "blind" : undefined);
			break;
		}
		this.anankeOptions.setLinkType(setting);
	},
	updateTable: function() {
		this.table.find("tr").remove();
		if(this.model.items.length == 0) {
			this.table.append("<tr><td></td><td colspan='3'><em>None</em></td></tr>")
			return;
		}
		var running = 0;
		for(var i = 0; i < this.model.items.length; i++) {
			var item = this.model.items[i];
			if (item.isPaused == false) running++;
			this.taskTemplate.tmpl(item, this.constructor.templateHelpers).appendTo(this.table).attr("data-item-index", i);
		}

		window.Ananke.updateBadge(running);
		this.updateTimes();

	},
	updateTimes: function() {
		var items = this.model.items;
		var total = 0;

		var updaterFuct = this._safeUpdateTime;

		this.table.find("tr").each(function(i,e) {
			var tr = $(e);
			var index = tr.attr("data-item-index");
			if(index) {
				var item = items[index];
				total += item.getElapsed();
				if(!tr.hasClass("over")) {
					var newElapsed = item.getHumanElapsed()
					var target = tr.find("td.elapsed");
					updaterFuct(newElapsed, target);
				}
			}
		});

		updaterFuct(this.itemClass.msToHumanTime(total), this.totalTime);
	},
	_safeUpdateTime: function(value, target) {
		if(target.text() != value) target.text(value);
	},
	taskNameUpdate: function(e) {
		if(this.taskName.val())
			this.taskName.removeClass("empty");
		else
			this.taskName.addClass("empty").val(this.constructor.emptyNameText);
	},
	taskURLUpdate: function(e) {
		if(this.taskURL.val())
			this.taskURL.removeClass("empty");
		else
			this.taskURL.addClass("empty").val(this.constructor.emptyURLText);
	},
	taskNameFocused: function(e) {
		if(this.taskName.hasClass("empty"))
			this.taskName.removeClass("empty").val("");
	},
	taskURLFocused: function(e) {
		if(this.taskURL.hasClass("empty"))
			this.taskURL.removeClass("empty").val("");
	}
});
