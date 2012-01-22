request('org.xiha.html5.core');

org.xiha.html5.core.Circle = function(scene, centerPosition, w, h, id) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);
	this.render = function() {

		var ctx = this.getContext();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;

		ctx.arc(this.centerPosition.getX(), this.centerPosition.getY(), 20, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	};
};


org.xiha.html5.util
		.extend(org.xiha.html5.core.Circle, org.xiha.html5.core.Cube);// 继承关系

