request('org.xiha.html5.core');

org.xiha.html5.core.Arccube = function(scene, centerPosition, w, h) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h);
	this._DEFAULT_R = 5;
	this.r = this._DEFAULT_R;
	this.renderableText = null;

	this.render = function() {

		var ctx = this.getContext();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		// var rec = this.ccRect(this.centerPosition, this.w, this.h, this.r);

		// ctx.arc(rec.c1.x, rec.c1.y, this.r, Math.PI, 1.5 * Math.PI, false);
		// ctx.arc(rec.c2.x, rec.c2.y, this.r, 1.5 * Math.PI, 2 * Math.PI,
		// false);
		// ctx.arc(rec.c3.x, rec.c3.y, this.r, 0, 0.5 * Math.PI, false);
		// ctx.arc(rec.c4.x, rec.c4.y, this.r, 0.5 * Math.PI, Math.PI, false);
		// 圆弧矩形算法
		var x = this.centerPosition.getX();
		var y = this.centerPosition.getY();
		ctx.moveTo(x - (w / 2) + this.r, y - (h / 2));
		ctx.lineTo(x + (w / 2) - this.r, y - (h / 2));
		ctx.arcTo(x + (w / 2), y - (h / 2), x + (w / 2), y - (h / 2) + this.r,
				this.r);
		ctx.lineTo(x + (w / 2), y + (h / 2) - this.r);
		ctx.arcTo(x + (w / 2), y + (h / 2), x + (w / 2) - this.r, y + (h / 2),
				this.r);
		ctx.lineTo(x - (w / 2) + this.r, y + (h / 2));
		ctx.arcTo(x - (w / 2), y + (h / 2), x - (w / 2), y + (h / 2) - this.r,
				this.r);
		ctx.arcTo(x - (w / 2), y - (h / 2) + this.r);
		ctx.arcTo(x - (w / 2), y - (h / 2), x - (w / 2) + this.r, y - (h / 2),
				this.r);

		ctx.closePath();
		ctx.fill();
		if (this.renderableText != null) {
			ctx.fillStyle = this.renderableText.fillStyle();
			ctx.font = this.renderableText.font();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(this.renderableText.text(), x, y);
		}

	};

	this.ccRect = function(position, w, h, r) {
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

