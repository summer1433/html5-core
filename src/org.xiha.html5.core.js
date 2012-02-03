request('org.xiha.html5.util');

org.xiha.html5.core = {};

org.xiha.html5.core.NormalPoint = function(x, y) {
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
};

org.xiha.html5.core.Event = function(msg, object) {
	this.msg = msg;
	this.object = object;
};

org.xiha.html5.core.EventPool = function(maxsize, scene) {
	this.scene = scene;
	this._DEFAULT_MAX_SIZE = 100;
	this.maxsize = 0;
	this.events = new Array();
	if (maxsize == null || maxsize <= 0) {
		this.maxsize = this._DEFAULT_MAX_SIZE;
	} else {
		this.maxsize = maxsize;
	}
	//console.log('event pool init,maxsize:' + this.maxsize);
	this.getRecentEvent = function() {
		var len = this.events.length;
		if (len != 0)
			return this.events[len - 1];
	};

	this.addNewEvent = function(event) {
		this.events.push(event);

		while (this.events.length >= this.maxsize) {
			this.events.shift();
			//console.log("event pool full,shift some old event");
		}

		var listeners = this.scene.renderAble;
		for ( var i = 0; i < listeners.length; i++) {
			if (listeners[i].listenEvent != null) {
				listeners[i].listenEvent();
				//console.log(listeners[i]);
			}
		}

		return true;
	};

};
