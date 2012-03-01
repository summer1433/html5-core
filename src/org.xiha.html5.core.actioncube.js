request('org.xiha.html5.core');

org.xiha.html5.core.Actioncube = function(centerPosition, w, h, offsetLeft,
		offsetTop) {
	org.xiha.html5.core.Arccube.call(this, centerPosition, w, h);
	this.addClickAbility();
	this.offsetLeft = offsetLeft;
	this.offsetTop = offsetTop;
	this.snapTo = null;
	this.currentEvent = null;
	this.doClick = function() {

	};
	this.renderbefore = function() {
		this.centerPosition = new org.xiha.html5.core.NormalPoint(
				this.snapTo.centerPosition.getX() + this.offsetLeft,
				this.snapTo.centerPosition.getY() + this.offsetTop);
	};

};

org.xiha.html5.util.extend(org.xiha.html5.core.Actioncube,
		org.xiha.html5.core.Arccube);

org.xiha.html5.core.Actioncube.prototype.listenEvent = function(ev) {
	this.currentEvent = ev;
	if (ev.msg == (new org.xiha.html5.core.Constants()).CLICK_EVENT) {
		this.snapTo = ev.object;
		if (this.snapTo.typeId == 0) {

			var cp = new org.xiha.html5.core.NormalPoint(
					this.snapTo.centerPosition.getX() + this.offsetLeft,
					this.snapTo.centerPosition.getY() + this.offsetTop);
			this.centerPosition = cp;
		}else{
			this.centerPosition = null;
		}
	}
	// console.log(e);
};

org.xiha.html5.core.Actioncube.prototype.mouseclickAction = function(ev) {
	var self = this;
	var evt = window.event || arguments[0];
	var mouse = org.xiha.html5.util.getMouse(evt, this.getCanvas());
	if (self.isOver(mouse)) {
		self.doClick();

	}
};