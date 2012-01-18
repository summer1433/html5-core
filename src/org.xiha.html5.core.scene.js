org.xiha.html5.core.Scene = function(canvas, id) {
	var self = this;
	this.id = id;
	this.renderAble = new Array();
	this.canvas = canvas;
	this.sos = new Array();// selected objects
	this.isMultiSelect = false;
	this.allRender = true;
	this.rootNode = null;
	this.nodeUtil = null;
	this.setRootNode = function(node, nodeUtil) {
		this.nodeUtil = nodeUtil;
		this.rootNode = node;
	};
	this.getWidth = function() {
		return this.canvas.width;
	};

	this.getHeight = function() {
		return this.canvas.height;
	};

	this.getContext = function() {
		return this.canvas.getContext("2d");
	};

	this.addRenderable = function(o) {
		this.renderAble.push(o);
	};

	this.canvas.addEventListener('click', function() {

		for ( var n = 0; n < self.renderAble.length; n++) {
			var c = self.renderAble[n];
			if (c.clickEnable)
				if (c.isSelect()) {
					// console.log(self);
					// self.setFillStyle('rgb(0,0,0)');
					// c.canRenderme();
				} else {
					// self.restore();
					// c.canRenderme();
				}
		}

	}, false);

	// this.canvas.addEventListener('mousemove', function() {
	// for ( var n = 0; n < self.renderAble.length; n++) {
	// var c = self.renderAble[n];
	// if (c.isSelect()) {
	//
	// }
	// c.canRenderme();// 全部渲染效率也很OK，所以全部渲染吧
	// }
	// }, false);

};
org.xiha.html5.core.Scene.prototype = {

	ready : function() {
		var self = this;
		if (self.rootNode != null) {
			this.nodeUtil.ergod(this.rootNode);
		}
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

			if (self.allRender) {
				
				self.clearScene();
				//self.nodeUtil.ergod(self.rootNode);
				for ( var i = 0; i < self.renderAble.length; i++) {

					self.renderAble[i].render();

				}

				self.allRender = false;
			}

			//

		}, 1);

	},

	enableMultiSelect : function() {
		this.isMultiSelect = true;
	},

	isInSelect : function(o) {
		for ( var i = 0; i < this.sos.length; i++) {
			if (o.id == this.sos[i].id) {
				return true;
			}
		}
		return false;
	},

	select : function(o) {

		if (this.isMultiSelect) {
			o.inSelect = true;
			this.sos.push(o);

		} else {
			if (this.sos.length == 0) {
				o.inSelect = true;
				this.sos.push(o);
			} else if (this.sos.length == 1) {
				o.inSelect = true;
				this.sos.pop();
				this.sos.push(o);
			}
		}

	},
	clearSelect : function() {
		this.sos = new Array();
	},
	clearScene : function() {
		// console.log("w:"+this.getWidth()+",h:"+this.getHeight());
		this.getContext().clearRect(0, 0, this.getWidth(), this.getHeight());
	}

};