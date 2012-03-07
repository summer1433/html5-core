org.xiha.html5.core.Scene = function(canvas, id) {
	var self = this;
	this.id = id;
	this.objectIdSequence = 0;
	this.objectMap = {};
	this.renderAble = new Array();
	this.listeners = new Array();

	this.canvas = canvas;

	this.sos = new Array();// selected objects
	this.isMultiSelect = false;
	this.allRender = true;
	this.rootNode = null;
	this.mouse = null;
	this.setRootNode = function(node) {
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
	this.addListener = function(obj) {
		if (obj.listenEvent != null) {

			this.listeners.push(obj);
		} else {
			console.log("obj not implements listenEvent function!!");
		}
	};
	this.removeRenderable = function(id) {
		delete this.objectMap[id];
		for ( var i = 0; i < this.renderAble.length; i++) {
			if (id == this.renderAble[i].id) {
				this.renderAble.splice(i, 1);
				break;
			}
		}

	};
	this.addRenderable = function(o) {
		this.objectIdSequence++;

		if (o.id == null) {
			o.id = this.objectIdSequence;
			this.objectMap[this.objectIdSequence] = o;
			this.renderAble.push(o);
		} else if (o.id >= 0) {
			if (this.objectMap[o.id] == null) {
				this.objectMap[o.id] = o;
				this.renderAble.push(o);

			} else {
				console.log("object already exist, object is:");
				console.log(o);
			}

		}

	};

	// 注册事件
	var mda = function(ev) {
		var evt = window.event || arguments[0];

		self.mouse = org.xiha.html5.util.getMouse(evt, self.canvas);

		window.org.xiha.html5.core.eventPool
				.addNewEvent(new org.xiha.html5.core.Event(
						window.org.xiha.html5.core.constants.MOUSE_DOWN_EVENT,
						self));
	};

	this.canvas.addEventListener('mousedown', mda, false);

	var mca = function(ev) {
		var evt = window.event || arguments[0];

		self.mouse = org.xiha.html5.util.getMouse(evt, self.canvas);

		window.org.xiha.html5.core.eventPool
				.addNewEvent(new org.xiha.html5.core.Event(
						window.org.xiha.html5.core.constants.MOUSE_CLICK_EVENT,
						self));
	};

	this.canvas.addEventListener('click', mca, false);

	var mma = function(ev) {
		var evt = window.event || arguments[0];

		self.mouse = org.xiha.html5.util.getMouse(evt, self.canvas);
		window.org.xiha.html5.core.eventPool
				.addNewEvent(new org.xiha.html5.core.Event(
						window.org.xiha.html5.core.constants.MOUSE_MOVE_EVENT,
						self));
	};

	this.canvas.addEventListener('mousemove', mma, false);

	var mua = function(ev) {
		var evt = window.event || arguments[0];

		self.mouse = org.xiha.html5.util.getMouse(evt, self.canvas);
		window.org.xiha.html5.core.eventPool
				.addNewEvent(new org.xiha.html5.core.Event(
						window.org.xiha.html5.core.constants.MOUSE_UP_EVENT,
						self));
	};
	this.canvas.addEventListener('mouseup', mua, false);

	var mdca = function(ev) {
		var evt = window.event || arguments[0];

		self.mouse = org.xiha.html5.util.getMouse(evt, self.canvas);
		window.org.xiha.html5.core.eventPool
				.addNewEvent(new org.xiha.html5.core.Event(
						window.org.xiha.html5.core.constants.MOUSE_DBCLICK_EVENT,
						self));
	};
	this.canvas.addEventListener('dblclick', mdca, false);

	// 定义全局可见
	window.org.xiha.html5.core.scene = self;
};
org.xiha.html5.core.Scene.prototype = {

	ready : function() {
		var self = this;
		if (self.rootNode != null) {
			// window.org.xiha.html5.core.nodeUtil.ergod(this.rootNode);
		}
		self.allReady();
	},

	allReady : function() {

		var self = this;

		// 渲染所有可渲染的组件
		// TODO 设定渲染先后顺序，因为渲染的时候需要Clear，所以必须得设定顺序
		setInterval(function() {

			if (self.allRender) {

				self.clearScene();
				// self.nodeUtil.ergod(self.rootNode);
				for ( var i = 0; i < self.renderAble.length; i++) {
					if (self.renderAble[i].render != null)
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
			if (o.id == this.sos[i].id && o.inSelect == true) {
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

				var selected = this.sos.pop();
				selected.inSelect = false;
				o.inSelect = true;
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