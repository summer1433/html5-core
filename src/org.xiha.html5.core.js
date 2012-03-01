request('org.xiha.html5.util');

org.xiha.html5.core = {};

org.xiha.html5.core.NormalPoint = function(x, y) {
	this.x = x;
	this.y = y;
	this.point = {
		'x' : x,
		'y' : y
	};
	this.getX = function() {
		return x;
	};
	this.getY = function() {
		return y;
	};
};

org.xiha.html5.core.NormalPoint.prototype.transTo = function() {

};

org.xiha.html5.core.RenderableText = function(text, fillStyle, font) {
	this.t = text;
	this.text = function() {
		return text;
	};
	this.fillStyle = function() {
		return fillStyle;
	};
	this.font = function() {
		return font;
		;
	};
};

org.xiha.html5.core.Constants = function() {
	this.CLICK_EVENT = 'CLICK_EVENT';
	this.DOUBLE_CLICK_EVENT = 'DOUBLE_CLICK_EVENT';
};

org.xiha.html5.core.Event = function(msg, object) {
	this.msg = msg;
	this.object = object;
};

org.xiha.html5.core.EventPool = function(maxsize) {
	var self = this;
	this.scene = window.org.xiha.html5.core.scene;
	this._DEFAULT_MAX_SIZE = 100;
	this.maxsize = 0;
	this.events = new Array();
	if (maxsize == null || maxsize <= 0) {
		this.maxsize = this._DEFAULT_MAX_SIZE;
	} else {
		this.maxsize = maxsize;
	}

	this.getRecentEvent = function() {
		var len = this.events.length;
		if (len != 0)
			return this.events[len - 1];
	};

	this.addNewEvent = function(event) {
		this.events.push(event);

//		while (this.events.length >= this.maxsize) {
//			this.events.shift();
//			console.log("事件满了，丢弃掉没有来得及处理的老事件");
//		}

		return true;
	};

	setInterval(function() {
		var listeners = self.scene.renderAble;
		if (self.events != null && self.events.length > 0) {
			var ev = self.events.shift();
			
			for ( var i = 0; i < listeners.length; i++) {
				if (listeners[i].listenEvent != null) {
					listeners[i].listenEvent(ev);
					// console.log(listeners[i]);
				}
			}
		}
	}, 1);

	window.org.xiha.html5.core.eventPool = self;

};
