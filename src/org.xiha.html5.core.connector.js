request('org.xiha.html5.core');
request('org.xiha.html5.core.scene');

org.xiha.html5.core.Connector = function(scene, cube1, cube2, strokeStyle,
		fillStyle, lineWidth) {
	this.scene = scene;
	this.cube1 = cube1;
	this.cube2 = cube2;
	this.strokeStyle = strokeStyle;
	this.fillStyle = fillStyle;
	this.lineWidth = lineWidth;
	this.renderme = false;
	scene.addRenderable(this);
};

org.xiha.html5.core.Connector.prototype = {
	canRenderme : function() {
		this.renderme = true;
	},
	stopRenderme : function() {
		this.renderme = false;
	},
	isSelect : function() {
		return false;
	},
	render : function() {
		var ctx = this.scene.getContext();
		ctx.strokeStyle = this.strokeStyle;
		ctx.fillStyle = this.fillStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.beginPath();
		var xy1 = this.cal(this.cube1.centerPosition,
				this.cube2.centerPosition, this.cube1.w, this.cube1.h);

		ctx.moveTo(xy1.x, xy1.y);
		var xy2 = this.cal(this.cube2.centerPosition,
				this.cube1.centerPosition, this.cube2.w, this.cube2.h);
		ctx.lineTo(xy2.x, xy2.y);
		ctx.stroke();
		ctx.closePath();
		// console.log("rend connector:"+this.cp1+","+this.cp2);

	},
	// 计算线连接点，并不直接连接到centerposition
	cal : function(c1, c2, w, h) {

		var a = Math.atan2(c2.getY() - c1.getY(), c2.getX() - c1.getX());
		var b = Math.atan(h / w);
		var xi = c1.getX();
		var yi = c1.getY();
		if ((a > 0 && a < b) || a < 0 && a > -b) {
			console.log("debug 1");

			return {
				x : xi + (w / 2),
				y : yi + (w * Math.tan(a) / 2)
			};
		} else if ((a > Math.PI - b && a < Math.PI)
				|| (a > -Math.PI && a < -Math.PI + b)) {
			console.log("debug 2");

			return {
				x : xi - (w / 2),
				y : yi - (w * Math.tan(a) / 2)
			};
		} else if (a > b && a < Math.PI - b) {
			console.log("debug 3");

			return {
				x : xi + h / (2 * Math.tan(a)),
				y : yi + h / 2
			};
		} else if (a < -b && a > -Math.PI + b) {
			console.log("debug 4");
			return {
				x : xi - h / (2 * Math.tan(a)),
				y : yi - h / 2
			};
		}

	},

};