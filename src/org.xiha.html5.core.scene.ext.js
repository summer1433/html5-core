request('org.xiha.html5.core');

org.xiha.html5.core.Scene.prototype.gravity = function(g) {
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

						y = y + 1;
						o.addTrack(new org.xiha.html5.core.NormalPoint(x, y));
						renderAll = true;

					}
				}
			}
		}
		if (renderAll)
			for ( var i = 0; i < self.renderAble.length; i++) {
				self.renderAble[i].canRenderme();
			}

	}, g);

};