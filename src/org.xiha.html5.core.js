var org = {};
org.xiha = {};
org.xiha.html5 = {};
org.xiha.html5.core = {};
org.xiha.html5.util = {
	getTrueOffsetLeft : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetLeft || 0;
			ele = ele.offsetParent;
		}

		return n;
	},
	getTrueOffsetTop : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetTop || 0;
			ele = ele.offsetParent;
		}
		return n;
	},

	getMouse : function(e, canvas) {
		var width = canvas.width;
		var height = canvas.height;
		var x = e.clientX - this.getTrueOffsetLeft(canvas) + window.pageXOffset;
		var y = e.clientY - this.getTrueOffsetTop(canvas) + window.pageYOffset;

		// 控制边界
		return [ Math.min(width - 3, Math.max(3, x)),
				Math.min(height - 3, Math.max(3, y)) ];

	}
};

org.xiha.html5.core.NormalPoint = function(x, y) {
	this.getX = function() {
		return x;
	};
	this.getY = function() {
		return y;
	};
};

org.xiha.html5.core.NormalPoint.prototype.transTo = function() {

};

org.xiha.html5.core.Scene = function(canvas, id) {

	this.id = id;
	this.renderAble = new Array();
	this.canvas = canvas;
	this.sos = new Array();// selected objects
	this.addRenderable = function(o) {
		this.renderAble.push(o);
	};

};

org.xiha.html5.core.Scene.prototype.ready = function() {
	var self = this;
	self.allReady();
};

org.xiha.html5.core.Scene.prototype.allReady = function() {
	console.log('renderall o');
	for ( var i = 0; i < this.renderAble.length; i++) {
		this.renderAble[i].canRenderme();
		this.renderAble[i].ready();
	}

	var self = this;

	setInterval(function() {
		self.checkOverlap();
	}, 1);
};

org.xiha.html5.core.Scene.prototype.select = function(o) {
	this.sos.push(o);
};

org.xiha.html5.core.Scene.prototype.clearSelect = function() {
	this.sos = new Array();
};

org.xiha.html5.core.Scene.prototype.checkOverlap = function() {
	for ( var i = 0; i < this.sos.length; i++) {
		for ( var j = 0; j < this.renderAble.length; j++) {
			if (this.sos[i].id != this.renderAble[j].id
					&& this.sos[i].overlapping(this.renderAble[j])) {

			}
			;
			// console.log('overlapping, cube id:' + this.renderAble[i]);

		}
	}
};

org.xiha.html5.core.Cube = function(scene, centerPosition, w, h, id) {
	this.id = id;

	this.scene = scene;
	this.getCanvas = function() {
		return scene.canvas;
	};

	var context = scene.canvas.getContext("2d");

	this.getContext = function() {
		return context;
	};

	this.centerPosition = centerPosition;

	this.getCenterPosition = function() {
		return this.centerPosition;
	};
	this.getW = function() {
		return w;
	};
	this.getH = function() {
		return h;
	};

	this.savedFillStyle = '';

	this.fillStyle = '';

	this.isMoving = false;

	this.trackPositoin = new Array();

	this.renderme = false;

	scene.addRenderable(this);

};

org.xiha.html5.core.Cube.prototype.render = function() {

	var ctx = this.getContext();
	ctx.fillStyle = this.fillStyle;
	// console.log("render cube id:" + this.id);
	if (this.isMoving && this.trackPositoin != null
			&& this.trackPositoin.length >= 0) {

		while (this.trackPositoin.length != 0) {
			var p = this.trackPositoin.pop();
			// console.log("clear rect i:" + i + ",p:" + p);
			drawx = p.getX() - this.getW() / 2;
			drawy = p.getY() - this.getH() / 2;
			ctx.clearRect(drawx, drawy, this.getW(), this.getH());

		}

	}

	// 2.draw to context
	var drawx = this.getCenterPosition().getX() - this.getW() / 2;
	var drawy = this.getCenterPosition().getY() - this.getH() / 2;

	ctx.fillRect(drawx, drawy, this.getW(), this.getH());
	ctx.fillStyle = 'white';
	ctx.fillText(this.id, drawx, drawy + 10);
	// 3.clear fillStyle
	ctx.fillStyle = '';

};

org.xiha.html5.core.Cube.prototype.enableMoving = function() {
	this.isMoving = true;
	this.addMovingAbility();
};

org.xiha.html5.core.Cube.prototype.addTrack = function(newCenterPostion) {
	this.trackPositoin.push(this.centerPosition);
	this.centerPosition = newCenterPostion;
};

org.xiha.html5.core.Cube.prototype.isSelect = function(mouse) {
	var inSelect = false;
	var x1 = this.getCenterPosition().getX() - this.getW() / 2;
	var x2 = this.getCenterPosition().getX() + this.getW() / 2;
	var y1 = this.getCenterPosition().getY() - this.getH() / 2;
	var y2 = this.getCenterPosition().getY() + this.getH() / 2;

	if ((mouse[0] > x1 && mouse[0] < x2) && (mouse[1] > y1 && mouse[1] < y2))
		inSelect = true;

	return inSelect;
};

org.xiha.html5.core.Cube.prototype.overlapping = function(c) {
	var x1 = this.getCenterPosition().getX() - this.getW() / 2;
	var x2 = this.getCenterPosition().getX() + this.getW() / 2;
	var y1 = this.getCenterPosition().getY() - this.getH() / 2;
	var y2 = this.getCenterPosition().getY() + this.getH() / 2;

	var cx1 = c.getCenterPosition().getX() - c.getW() / 2;
	var cx2 = c.getCenterPosition().getX() + c.getW() / 2;
	var cy1 = c.getCenterPosition().getY() - c.getH() / 2;
	var cy2 = c.getCenterPosition().getY() + c.getH() / 2;

	if ((Math.abs(y1 - cy1) + Math.abs(y2 - cy2) >= this.getH() + c.getH())
			|| (Math.abs(x1 - cx1) + Math.abs(x2 - cx2) >= this.getW()
					+ c.getW())) {
		return false;
	} else {
		//console.log(c);
		//console.log(this);
		// console.log('overlapping..........');
		c.canRenderme();
		return true;
	}
};

org.xiha.html5.core.Cube.prototype.setFillStyle = function(style) {
	this.fillStyle = style;
};

org.xiha.html5.core.Cube.prototype.save = function() {
	this.savedFillStyle = this.fillStyle;
};

org.xiha.html5.core.Cube.prototype.restore = function() {
	this.fillStyle = this.savedFillStyle;
};
org.xiha.html5.core.Cube.prototype.canRenderme = function() {
	this.renderme = true;
};
org.xiha.html5.core.Cube.prototype.stopRenderme = function() {
	this.renderme = false;
};
org.xiha.html5.core.Cube.prototype.clickEnable = function() {
	var self = this;
	self.save();

	this.getCanvas().addEventListener('click', function(evt) {
		var mouse = org.xiha.html5.util.getMouse(evt, self.getCanvas());

		if (self.isSelect(mouse)) {
			console.log('select , cube id:' + self.id);
			self.setFillStyle('rgb(0,0,0)');
			self.canRenderme();
		} else {
			self.restore();
			self.canRenderme();
		}
	}, false);

};

org.xiha.html5.core.Cube.prototype.addMovingAbility = function() {
	var self = this;
	var mousemoveAction = function(evt) {
		evt = window.event || arguments[0];
		var mouse = org.xiha.html5.util.getMouse(evt, self.getCanvas());
		// 记录轨迹
		self.addTrack(new org.xiha.html5.core.NormalPoint(mouse[0], mouse[1]));
		self.canRenderme();

	};
	self.getCanvas().addEventListener(
			'mousedown',
			function(evt) {

				var mouse = org.xiha.html5.util.getMouse(evt, self.getCanvas());
				if (self.isSelect(mouse) && self.isMoving) {
					console.log('1.mousedown add mousemove listener, cube id:'
							+ self.id);
					self.scene.select(self);
					self.getCanvas().addEventListener('mousemove',
							mousemoveAction, false);

					// when mouseup remove listener
					self.getCanvas().addEventListener(
							'mouseup',
							function() {
								console.log('2.mouseup try to remove, cube id:'
										+ self.id);
								self.scene.clearSelect();
								if (self.getCanvas().removeEventListener) {
									console.log('3.remove event, cube id:'
											+ self.id);

									self.getCanvas()
											.removeEventListener('mousemove',
													mousemoveAction, false);
									self.stopRenderme();
								} else {
									console.log('cant remove');
								}

							}, false);
				}

			}, false);

};

org.xiha.html5.core.Cube.prototype.ready = function() {
	var self = this;

	setInterval(function() {
		if (self.renderme) {
			self.render();
		}
		self.stopRenderme();
	}, 1);

};