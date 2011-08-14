/*
request org.xiha.html5.core
 */
request('org.xiha.html5.core');

org.xiha.html5.game = {};
org.xiha.html5.game.lian = {};

org.xiha.html5.game.lian.Poker = function(scene, centerPosition, w, h, id) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);

};

org.xiha.html5.util.extend(org.xiha.html5.game.lian.Poker,
		org.xiha.html5.core.Cube);// 继承关系

org.xiha.html5.game.lian.Poker.prototype.destory = function() {
	var ctx = this.getContext();

	var r = this.caculateRect(this.getCenterPosition(), this.getW(), this
			.getH());

	ctx.clearRect(r.x, r.y, r.w, r.h);
	
	
	this.clickEnable = false;
	

};
org.xiha.html5.game.lian.Pokers = function(scene, normalPoint, wsize, hsize,
		exampleStyle) {

	var pw = 40;
	var ph = 40;
	var psx1 = normalPoint.getX() - (pw * (wsize / 2));
	var psy1 = normalPoint.getY() - (ph * (hsize / 2));

	this.wo = new Array();

	for ( var i = 1; i <= hsize; i++) {
		var ho = new Array();

		for ( var j = 1; j <= wsize; j++) {

			var np = new org.xiha.html5.core.NormalPoint(psx1 + (j - 1 / 2)
					* pw, psy1 + (i - 1 / 2) * ph);
			var poker = new org.xiha.html5.game.lian.Poker(scene, np, pw, ph,
					new Array(i, j));
			var styleIndex = Math.floor(Math.random() * 10) % 5;

			var fillStyle = exampleStyle[styleIndex];

			poker.setFillStyle(fillStyle);
			poker.clickEnable = true;

			ho.push(poker);
		}
		this.wo.push(ho);
	}
	var self = this;
	// add click listener
	scene.canvas.addEventListener('click', function() {
		var selectedPokers = new Array();
		var selectedPokerNum = 0;
		for ( var i = 0; i < self.wo.length; i++) {
			for ( var j = 0; j < self.wo[i].length; j++) {
				if (self.wo[i][j].inSelect) {
					selectedPokerNum++;
					selectedPokers.push(self.wo[i][j]);
					// console.log(self.wo[i][j]);
				}
			}
		}

		for ( var k = 0; k < selectedPokers.length; k++) {
			selectedPokers[k].destory();// ///
		}

		console.log('selectedPokerNum:' + selectedPokerNum);

	}, false);
};