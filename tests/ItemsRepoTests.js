$(document).ready(function() {
	
	var core = "Items Repo - "
	module(core + "Instance Methods", {
		setup: function() {
			this.obj = {k:""}
			this.key = "k"
			this.repo = new Ananke.ItemsRepository(this.obj, this.key)
		}
	})

	test("should respond to deleteItem and return the deleted item", function() {
		this.repo.items = [1,2,3]
		var deletedItem = this.repo.deleteItem(1);
		deepEqual(deletedItem, [2]);
	})

})