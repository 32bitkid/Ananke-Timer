window.Ananke = {};

window.Ananke.options = {
	getPauseOnCreate: function() { return localStorage["Ananke.options.pauseOnCreate"] == "true" },
	setPauseOnCreate: function(val) { localStorage["Ananke.options.pauseOnCreate"] = (val) ? "true" : "false"; }
}