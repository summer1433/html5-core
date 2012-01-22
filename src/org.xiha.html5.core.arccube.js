request('org.xiha.html5.core');

org.xiha.html5.core.Arccube = function(scene, centerPosition, w, h, id) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);
	this.r = 5;
	this.render = function() {

		var ctx = this.getContext();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		var rec = this.ccRect(this.centerPosition, this.w, this.h, this.r);

		ctx.arc(rec.c1.x, rec.c1.y, this.r, Math.PI, 1.5 * Math.PI, false);
		ctx.arc(rec.c2.x, rec.c2.y, this.r, 1.5 * Math.PI, 2 * Math.PI, false);
		ctx.arc(rec.c3.x, rec.c3.y, this.r, 0, 0.5 * Math.PI, false);
		ctx.arc(rec.c4.x, rec.c4.y, this.r, 0.5 * Math.PI, Math.PI, false);
		console.log(this.centerPosition.getX());
		
		//ctx.lineWidth = 5 ;
		//ctx.strokeStyle = 'black';
		
		//ctx.stroke();
		
		//ctx.arc(this.centerPosition.getX(), this.centerPosition.getY(), 20, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		//ctx.stroke();
	};

	this.ccRect = function(position, w, h, r) {
		console.log("fff");
		return {
			c1 : {
				x : (position.getX() - (w / 2 - r)),
				y : (position.getY() - (h / 2 - r))
			},
			c2 : {
				x : (position.getX() + (w / 2 - r)),
				y : (position.getY() - (h / 2 - r))
			},
			c3 : {
				x : (position.getX() + (w / 2 - r)),
				y : (position.getY() + (h / 2 - r))

			},
			c4 : {
				x : (position.getX() - (w / 2 - r)),
				y : (position.getY() + (h / 2 - r))

			}
		};
	};

};

org.xiha.html5.util.extend(org.xiha.html5.core.Arccube,
		org.xiha.html5.core.Cube);// 继承关系

