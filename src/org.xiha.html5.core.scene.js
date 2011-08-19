org.xiha.html5.core.Scene = function(canvas, id) {
	var self = this;
	this.id = id;
	this.renderAble = new Array();
	this.canvas = canvas;
	this.sos = new Array();// selected objects

	this.getWidth = function() {
		this.getContext().width;
	};

	this.getHeight = function() {
		this.getContext().height;
	};

	this.getContext = function() {
		return this.canvas.getContext("2d");
	};

	this.addRenderable = function(o) {
		this.renderAble.push(o);
	};

	this.canvas.addEventListener('click', function() {

		var evt = window.event || arguments[0];

		var mouse = org.xiha.html5.util.getMouse(evt, self.canvas);

		for ( var n = 0; n < self.renderAble.length; n++) {
			var c = self.renderAble[n];
			if (c.clickEnable)
				if (c.isSelect(mouse)) {
					// console.log(self);
					// self.setFillStyle('rgb(0,0,0)');
					c.canRenderme();
				} else {
					// self.restore();
					c.canRenderme();
				}
		}

	}, false);

};
org.xiha.html5.core.Scene.prototype = {
	ready : function() {
		var self = this;
		self.allReady();
	},

	allReady : function() {
		console.log('renderall o');
		for ( var i = 0; i < this.renderAble.length; i++) {
			this.renderAble[i].canRenderme();

			// this.renderAble[i].ready();
		}

		var self = this;

		// 渲染所有可渲染的组件
		// TODO 设定渲染先后顺序，因为渲染的时候需要Clear，所以必须得设定顺序
		setInterval(function() {
			for ( var i = 0; i < self.renderAble.length; i++) {

				if (self.renderAble[i].renderme) {
					self.renderAble[i].render();
				}
				self.renderAble[i].stopRenderme();
			}
		}, 1);

	},
	select : function(o) {
		this.sos.push(o);
	},
	clearSelect : function() {
		this.sos = new Array();
	},

	/**
	 * 循环检测是否互相重叠
	 * TODO 实现递归检测所有链式重叠状况
	 */
	checkOverlap : function() {
		for ( var i = 0; i < this.sos.length; i++) {
			for ( var j = 0; j < this.renderAble.length; j++) {
				if (this.sos[i].id != this.renderAble[j].id
						&& this.sos[i].overlapping(this.renderAble[j])) {

				}
				;
				// console.log('overlapping, cube id:' + this.renderAble[i]);

			}
		}
	}
};