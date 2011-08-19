request('org.xiha.html5.core');

org.xiha.html5.core.Scene.prototype.gravity = function(g) {
	var self = this;
	setInterval(function() {
		for ( var i = 0; i < self.renderAble.length; i++) {
			var cube = self.renderAble[i];
			var x = cube.centerPosition.getX();
			var y = cube.centerPosition.getY();
			var finalY = self.getHeight() - (cube.getH() / 2);
			if (y < finalY) {
				y = y + 1;
				cube.addTrack(new org.xiha.html5.core.NormalPoint(x, y));
				cube.canRenderme();
			}
		}
	}, 2);

};