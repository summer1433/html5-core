request('org.xiha.html5.core');

org.xiha.html5.core.Scene.prototype.gravity = function(g) {
	var self = this;
	setInterval(function() {
		for ( var i = 0; i < self.renderAble.length; i++) {
			var o = self.renderAble[i];
			var x = o.centerPosition.getX();
			var y = o.centerPosition.getY();

			if (y < self.getHeight() - o.getH() / 2) {
				y = y + 1;
				o.addTrack(new org.xiha.html5.core.NormalPoint(x, y));
				o.canRenderme();
			}
		}
	}, 2);

};