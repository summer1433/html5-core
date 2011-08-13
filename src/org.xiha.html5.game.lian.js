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

org.xiha.html5.game.lian.Pokers = function(normalPoint, wsize, hsize,exampleStyle) {

	var pw = 40;
	var ph = 40;
	var psx1 = normalPoint.getX() - (pw * (wsize / 2));
	var psy1 = normalPoint.getY() - (ph * (hsize / 2));

	this.wo = new Array();

	for ( var i = 1; i <= wsize; i++) {
		var ho = new Array();

		for ( var j = 1; j <= hsize; j++) {

			var np = new org.xiha.html5.core.NormalPoint(psx1 + (i - 1 / 2)
					* pw, psy1 + (j - 1 / 2) * ph);
			var poker = new org.xiha.html5.game.lian.Poker(scene, np, pw, ph, 0);
			var styleIndex = Math.floor(Math.random() * 10) % 5;

			var fillStyle = exampleStyle[styleIndex];
			
			
			poker.setFillStyle(fillStyle);
			poker.clickEnable();

			ho.push(poker);
		}
		this.wo.push(ho);
	}

};