request('org.xiha.html5.core');

org.xiha.html5.core.Scene.prototype.gravity = function(g) {
	var t = 2;
	var self = this;
	setInterval(function() {
		var renderAll = false;
		for ( var i = 0; i < self.renderAble.length; i++) {

			var o = self.renderAble[i];
			if (o instanceof org.xiha.html5.core.Cube) {
				if (!o.inSelect) {
					var x = o.centerPosition.getX();
					var y = o.centerPosition.getY();
					var finalY = self.getHeight() - (o.getH() / 2);

					if (y < finalY) {
						o.timer = o.timer + t;
						y = y + (g * t * o.timer + g * t * t / 2)/1000;
						o.addTrack(new org.xiha.html5.core.NormalPoint(x, y));
						renderAll = true;

					} else {
						o.timer = 0;
					}
				}
			}
		}
		if (renderAll)
			self.allRender = true;

	}, t);

};