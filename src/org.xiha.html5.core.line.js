org.xiha.html5.core.Line = function(scene, lineWidth) {
	this.scene = scene;
	this.points = new Array();
};

org.xiha.html5.core.Line.prototype = {
	addPoint : function(centerPosition) {
		this.points.push(centerPosition);
	},
	clearPoints : function() {
		this.points = null;
		this.points = new Array();
	},
	render : function() {
		var ctx = this.getContext();
		ctx.strokeStyle = '#000000';

		for ( var m = 0; m < this.points.length; m++) {
			if (m != this.points.length - 1) {
				ctx.beginPath();
				var po1 = this.points[m];
				ctx.moveTo(po1.getX(), po1.getY());

				var po2 = this.points[m + 1];
				ctx.lineTo(po2.getX(), po2.getY());

				ctx.stroke();
			}

		}
	}

};