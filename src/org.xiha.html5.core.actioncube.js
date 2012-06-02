request('org.xiha.html5.core');

org.xiha.html5.core.Actioncube = function(centerPosition, w, h, offsetLeft,
		offsetTop) {
	var self = this;
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
	var superListenEvent = this.listenEvent;

	this.listenEvent = function(ev) {
		superListenEvent(ev);
		if (ev.msg == window.org.xiha.html5.core.constants.CLICK_EVENT) {

			self.currentEvent = ev;

			//已经snapTo过则
			if (self.snapTo != null && ev.object != null){
				if(self.snapTo.id == ev.object.id) {
					self.isDisplay = !self.isDisplay;
				}else{
					self.isDisplay = true;
				}
				
			}
				

			self.snapTo = ev.object;

			if (self.snapTo.typeId == 0) {

				var cp = new org.xiha.html5.core.NormalPoint(
						self.snapTo.centerPosition.getX() + self.offsetLeft,
						self.snapTo.centerPosition.getY() + self.offsetTop);
				self.centerPosition = cp;
			} else {
				self.centerPosition = null;
			}
		}
		// console.log(e);
	};
};

org.xiha.html5.util.extend(org.xiha.html5.core.Actioncube,
		org.xiha.html5.core.Arccube);

org.xiha.html5.core.Actioncube.prototype.mouseclickAction = function() {
	var self = this;
	if (self.isOver(self.scene.mouse)) {
		self.doClick();

	}
};