request('org.xiha.html5.core');

org.xiha.html5.core.Actioncube = function(centerPosition, w, h) {
	org.xiha.html5.core.Arccube.call(this, centerPosition, w, h);
	this.addClickAbility();
	this.snapTo = null;
	this.doClick = function() {

	};

};

org.xiha.html5.util.extend(org.xiha.html5.core.Actioncube,
		org.xiha.html5.core.Arccube);

org.xiha.html5.core.Actioncube.prototype.listenEvent = function() {
	var e = this.scene.eventPool.getRecentEvent();
	if (e.msg == (new org.xiha.html5.core.Constants()).CLICK_EVENT) {
		this.snapTo = e.object;
		var cp = new org.xiha.html5.core.NormalPoint(this.snapTo.centerPosition
				.getX() + 15, this.snapTo.centerPosition.getY() - 22);

		this.centerPosition = cp;
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