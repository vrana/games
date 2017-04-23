var start = {
	name: 'Start',
	visit: function (player) {
		earn(this.earns, player);
	},
	getEarns: function () {
		return this.earns;
	}
};
