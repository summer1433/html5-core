request('org.xiha.html5.core');
request('org.xiha.html5.core.scene');

org.xiha.html5.core.Cube = function(scene, centerPosition, w, h) {
	this.trackPositoin = new Array();
	this.w = w;
	this.h = h;
	this.id = null;
	this.timer = 0;// 计时用
	this.scene = scene;
	this.centerPosition = centerPosition;
	this.mouseOverPosition = null;

	this.clickEnable = false;
	this.inSelect = false;
	this.isMoving = false;
	this.clickDisable = false;
	this.renderme = false;

	this.savedFillStyle = '';
	this.fillStyle = '';
	this.task = '';
	this.image = null;

	this.getX = function() {
		return this.getCenterPosition().getX();
	};

	this.getY = function() {
		return this.getCenterPosition().getY();
	};

	this.getCanvas = function() {
		return scene.canvas;
	};

	this.getContext = function() {
		return this.scene.getContext();
	};

	this.getCenterPosition = function() {
		return this.centerPosition;
	};

	this.getW = function() {
		return this.w;
	};
	this.getH = function() {
		return this.h;
	};

	this.setFillStyle = function(style) {
		this.fillStyle = style;
	};
	this.enableMoving = function() {
		this.isMoving = true;
		this.addMovingAbility();
	};
	this.addMovingAbility = function() {
		var self = this;
		var mma = function() {
			self.mousemoveAction();

		};
		var mda = function() {
			self.mousedownAction(mma);
		};

		self.getCanvas().addEventListener('mousedown', mda, false);

	};
	this.addClickAbility = function() {
		var self = this;
		var mca = function() {
			self.mouseclickAction();
		};

		self.getCanvas().addEventListener('click', mca, false);
	};
	this.canRenderme = function() {
		this.renderme = true;
	};

	this.render = function() {
		this.renderbefore();

		var ctx = this.getContext();
		ctx.fillStyle = this.fillStyle;

		var r = this.caculateRect(this.getCenterPosition(), this.getW(), this
				.getH());
		ctx.fillRect(r.x, r.y, r.w, r.h);
		if (this.image != null) {
			try {
				ctx.drawImage(this.image, r.x, r.y, r.w, r.h);

			} catch (e) {
				console.log('[' + r.x + ',' + r.y + ',' + r.w + ',' + r.h
						+ ']-IMAGE[' + this.image.src + ']:' + e);
			}
		}

		if (this.inSelect) {
			ctx.lineWidth = '2';
			ctx.strokeStyle = 'black';
			var sr = this.caculateStrokeRect(r, ctx);
			ctx.strokeRect(sr.x, sr.y, sr.w, sr.h);// stroke是从中间开始描
		}
		// console.log('[' + r.x + ',' + r.y + ',' + r.w + ',' + r.h + ']');
		this.renderafter();
	};

	scene.addRenderable(this);

};

org.xiha.html5.core.Cube.prototype = {

	caculateRect : function(position, w, h) {
		return {
			x : position.getX() - w / 2,
			y : position.getY() - h / 2,
			w : w,
			h : h
		};

	},
	caculateStrokeRect : function(rect, ctx) {
		return {
			x : rect.x + ctx.lineWidth / 2,
			y : rect.y + ctx.lineWidth / 2,
			w : rect.w - ctx.lineWidth,
			h : rect.h - ctx.lineWidth
		};
	},

	renderbefore : function() {

	},

	renderafter : function() {

	},

	addTrack : function(newCenterPostion) {
		this.trackPositoin.push(this.centerPosition);
		this.centerPosition = newCenterPostion;
	},

	// isSelect : function() {
	// var evt = window.event || arguments[0];
	//
	// var mouse = org.xiha.html5.util.getMouse(evt, self.canvas);
	// if (this.isOver(mouse)) {
	// if (!this.inSelect)
	// this.inSelect = true;
	// else
	// this.inSelect = false;
	// }
	// return this.inSelect;
	// },

	isOver : function(mouse) {
		// console.log(mouse);
		var x1 = this.getCenterPosition().getX() - this.getW() / 2;
		var x2 = this.getCenterPosition().getX() + this.getW() / 2;
		var y1 = this.getCenterPosition().getY() - this.getH() / 2;
		var y2 = this.getCenterPosition().getY() + this.getH() / 2;

		if ((mouse[0] > x1 && mouse[0] < x2)
				&& (mouse[1] > y1 && mouse[1] < y2)) {

			this.mouseOverPosition = new org.xiha.html5.core.NormalPoint(
					mouse[0], mouse[1]);

			return true;
		} else {
			// this.inSelect = false;
			return false;
		}
	},

	/**
	 * 检测重叠组件
	 * 
	 * @param c
	 * @returns {Boolean}
	 */
	overlapping : function(c) {
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
			console.log(c);
			console.log(this);
			console.log('overlapping..........');
			c.canRenderme();
			return '';
		}
	},

	save : function() {
		this.savedFillStyle = this.fillStyle;
	},

	restore : function() {
		this.fillStyle = this.savedFillStyle;
	},

	stopRenderme : function() {
		this.renderme = false;
	},

};
/**
 * 匀速移动，保存移动轨迹，渲染时的流畅程度和轨迹有关
 * 
 * @param x
 * @param y
 */
org.xiha.html5.core.Cube.prototype.uniformMoveTo = function(x, y, mx, my) {
	this.addTrack(new org.xiha.html5.core.NormalPoint(x, y));
	this.mouseOverPosition = new org.xiha.html5.core.NormalPoint(mx, my);

};
org.xiha.html5.core.Cube.prototype.mouseclickAction = function() {
	var self = this;
	var evt = window.event || arguments[0];
	var mouse = org.xiha.html5.util.getMouse(evt, this.getCanvas());
	if (self.isOver(mouse)) {
		self.scene.select(self);
		self.scene.eventPool.addNewEvent(new org.xiha.html5.core.Event(
				(new org.xiha.html5.core.Constants()).CLICK_EVENT, self));

	}

	self.scene.allRender = true;
};
/**
 * mousemove action
 */
org.xiha.html5.core.Cube.prototype.mousemoveAction = function() {
	var self = this;
	var evt = window.event || arguments[0];
	var mouse = org.xiha.html5.util.getMouse(evt, this.getCanvas());
	// 记录轨迹
	// TODO 计算鼠标落在cube内位置，取得相对位移。
	var nx = this.centerPosition.getX()
			- (this.mouseOverPosition.getX() - mouse[0]);
	var ny = this.centerPosition.getY()
			- (this.mouseOverPosition.getY() - mouse[1]);

	self.uniformMoveTo(nx, ny, mouse[0], mouse[1]);
	self.scene.eventPool.addNewEvent(new org.xiha.html5.core.Event(
			(new org.xiha.html5.core.Constants()).CLICK_EVENT, self));
	// /self.scene.checkOverlap();
	self.scene.allRender = true;
};

/**
 * 鼠标up事件
 * 
 * 当鼠标up时需要注销移动事件，移动事件做为参数传递进入函数
 * 
 * @param mma
 *            鼠标移动事件
 */
org.xiha.html5.core.Cube.prototype.mouseupAction = function(mma) {
	var self = this;
	//console.log('2.mouseup try to remove, cube id:' + self.id);
	self.scene.clearSelect();
	if (self.getCanvas().removeEventListener) {
		// console.log('3.remove event, cube id:' + self.id);

		self.getCanvas().removeEventListener('mousemove', mma, false);
		self.scene.allRender = false;
	} else {
		console.log('cant remove');
	}

};

org.xiha.html5.core.Cube.prototype.mousedownAction = function(mma) {
	var self = this;
	var mua = function() {
		self.mouseupAction(mma);
	};
	var evt = window.event || arguments[0];
	var mouse = org.xiha.html5.util.getMouse(evt, self.getCanvas());
	if (self.isOver(mouse) && self.isMoving) {
		// console.log('1.mouse over the cube starting choose , cube id:'
		// + self.id);
		self.scene.select(self);
		if (self.scene.isInSelect(self)) {
			// console.log("2.cube " + self.id + " is inSelect");
			self.getCanvas().addEventListener('mousemove', mma, false);
			// when mouseup remove listener
			self.getCanvas().addEventListener('mouseup', mua, false);
			self.scene.allRender = true;
		}
	}
	;

};
