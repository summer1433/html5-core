request('org.xiha.html5.core');
request('org.xiha.html5.core.scene');

org.xiha.html5.core.ConnectorUtil = function() {
	this.bindingConnector = function(cube1, cube2, strokeStyle, fillStyle,
			lineWidth) {
		var renderAble = org.xiha.html5.core.scene.renderAble;
		var isExist = false;
		for ( var i = 0; i < renderAble.length; i++) {
			var cnn = renderAble[i];

			if (cnn instanceof org.xiha.html5.core.Connector) {
				if ((cnn.cube1.id == cube1.id && cnn.cube2.id == cube2.id)
						|| (cnn.cube1.id == cube2.id && cnn.cube2.id == cube1.id)) {
					isExist = true;
					//console.log("connector already exist, connector is:");
					//console.log(cnn);
					break;
				}
			}
		}
		if (!isExist) {
			new org.xiha.html5.core.Connector(cube1, cube2, strokeStyle,
					fillStyle, lineWidth);
		}
	};
};

org.xiha.html5.core.Connector = function(cube1, cube2, strokeStyle, fillStyle,
		lineWidth) {
	this.id = null;
	this.scene = org.xiha.html5.core.scene;
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
		var c1 = this.cube1.centerPosition;
		var c2 = this.cube2.centerPosition;
		var xy1 = this.cal(c1, c2, this.cube1.w, this.cube1.h);
		var xy2 = this.cal(c2, c1, this.cube2.w, this.cube2.h);

		var d1 = this.distance(xy1.x, xy1.y, c1.getX(), c1.getY());
		var d2 = this.distance(xy2.x, xy2.y, c2.getX(), c2.getY());
		var d0 = this.distance(c1.getX(), c1.getY(), c2.getX(), c2.getY());
		if (d1 + d2 <= d0) {
			ctx.moveTo(xy1.x, xy1.y);
			ctx.lineTo(xy2.x, xy2.y);
			ctx.stroke();
			ctx.closePath();
		}
		// console.log("rend connector:"+this.cp1+","+this.cp2);

	},
	distance : function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	},
	// 计算线连接点，并不直接连接到centerposition
	cal : function(c1, c2, w, h) {

		var a = Math.atan2(c2.getY() - c1.getY(), c2.getX() - c1.getX());
		var b = Math.atan(h / w);
		var xi = c1.getX();
		var yi = c1.getY();
		if ((a >= 0 && a <= b) || a < 0 && a >= -b) {
			// console.log("debug 1");

			return {
				x : xi + (w / 2),
				y : yi + (w * Math.tan(a) / 2)
			};
		} else if ((a >= Math.PI - b && a <= Math.PI)
				|| (a >= -Math.PI && a <= -Math.PI + b)) {
			// console.log("debug 2");

			return {
				x : xi - (w / 2),
				y : yi - (w * Math.tan(a) / 2)
			};
		} else if (a > b && a < Math.PI - b) {
			// console.log("debug 3");

			return {
				x : xi + h / (2 * Math.tan(a)),
				y : yi + h / 2
			};
		} else if (a < -b && a > -Math.PI + b) {
			// console.log("debug 4");
			return {
				x : xi - h / (2 * Math.tan(a)),
				y : yi - h / 2
			};
		} else {
			console.log(a);
			console.log(b);
		}

	},

};