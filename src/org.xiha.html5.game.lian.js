/*
request org.xiha.html5.core
 */
request('org.xiha.html5.core');

org.xiha.html5.game = {};
org.xiha.html5.game.lian = {};

org.xiha.html5.game.lian.Poker = function(scene, centerPosition, w, h, id) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);
	this.destroyed = false;
};

org.xiha.html5.util.extend(org.xiha.html5.game.lian.Poker,
		org.xiha.html5.core.Cube);// 继承关系

org.xiha.html5.game.lian.Poker.prototype.destroy = function() {
	var ctx = this.getContext();

	//clearInterval(this.task);
	this.render  =function() {
		
	};
	var r = this.caculateRect(this.getCenterPosition(), this.getW(), this
			.getH());

	ctx.clearRect(r.x, r.y, r.w, r.h);

	this.clickEnable = false;
	this.destroyed = true;

};
org.xiha.html5.game.lian.Pokers = function(scene, normalPoint, wsize, hsize,
		exampleStyle, images) {

	var pw = 50;
	var ph = 50;
	var psx1 = normalPoint.getX() - (pw * (wsize / 2));
	var psy1 = normalPoint.getY() - (ph * (hsize / 2));
	this.wsize = wsize;
	this.hsize = hsize;
	this.scene = scene;
	this.wo = new Array();
	this.liainTPoints = new Array();

	for ( var i = 1; i <= hsize; i++) {
		var ho = new Array();

		for ( var j = 1; j <= wsize; j++) {

			var np = new org.xiha.html5.core.NormalPoint(psx1 + (j - 1 / 2)
					* pw, psy1 + (i - 1 / 2) * ph);
			var poker = new org.xiha.html5.game.lian.Poker(scene, np, pw, ph,
					new Array(i, j));
			var styleIndex = Math.floor(Math.random() * 1000)
					% exampleStyle.length;

			var fillStyle = exampleStyle[styleIndex];
			poker.image = images[styleIndex];
			poker.setFillStyle(fillStyle);
			poker.clickEnable = true;

			ho.push(poker);
		}
		this.wo.push(ho);
	}
	this.selectedPokers = new Array();

	var self = this;
	// add click listener
	scene.canvas
			.addEventListener(
					'click',
					function() {
						var selectedPokerNum = 0;
						var p1, p2;

						var ctx = self.scene.getContext();
						for ( var i = 0; i < self.wo.length; i++) {
							for ( var j = 0; j < self.wo[i].length; j++) {
								if (self.wo[i][j].inSelect) {
									selectedPokerNum++;

									if (selectedPokerNum == 1) {
										p1 = self.wo[i][j];
									}
									if (selectedPokerNum == 2) {
										p2 = self.wo[i][j];
										if (self
												.checkLianTong(new Array(p1, p2))) {

											if (self.liainTPoints != null) {
												ctx.beginPath();
												for ( var m = 0; m < self.liainTPoints.length; m++) {
													var p = self.liainTPoints[m]
															.getCenterPosition();
													if (m == 0) {
														ctx.moveTo(p.getX(), p
																.getY());
													} else {

														ctx.lineTo(p.getX(), p
																.getY());
													}
												}

												ctx.fill();
											}

											p1.destroy();
											p2.destroy();
										}
										p1.inSelect = false;
										p2.inSelect = false;
										selectedPokerNum = 0;

										break;

									}

									self.selectedPokers.push(self.wo[i][j]);
									// console.log(self.wo[i][j]);
								}
							}
						}

						// console.log('selectedPokerNum:' + selectedPokerNum);

					}, false);
};

org.xiha.html5.game.lian.Pokers.prototype.checkLianTong = function(p) {

	var result = false;
	var p1 = p[0];
	var p2 = p[1];
	if (p1.image.src == p2.image.src) {
		if ((Math.abs(p1.id[0] - p2.id[0]) == 1 && p1.id[1] - p2.id[1] == 0)
				|| (Math.abs(p1.id[1] - p2.id[1]) == 1 && p1.id[0] - p2.id[0] == 0)) {

			result = true;
		} else {
			// scan1
			var i1 = new Array();

			var j1 = p1.id[1] - 1;

			for ( var i = p1.id[0]; i <= this.hsize; i++) {

				if (i == this.hsize || this.wo[i][j1].destroyed) {
					i1.push(i);
				} else {
					break;
				}
			}

			for ( var i = p1.id[0] - 1; i >= -1; i--) {

				if (i == -1 || i == p1.id[0] - 1 || this.wo[i][j1].destroyed) {
					i1.push(i);
				} else {
					break;
				}
			}

			var i2 = new Array();

			var j2 = p2.id[1] - 1;

			for ( var i = p2.id[0]; i <= this.hsize; i++) {

				if (i == this.hsize || this.wo[i][j2].destroyed) {
					i2.push(i);
				} else {
					break;
				}
			}
			// 包含自己
			for ( var i = p2.id[0] - 1; i >= -1; i--) {

				if (i == -1 || i == p2.id[0] - 1 || this.wo[i][j2].destroyed) {
					i2.push(i);
				} else {
					break;
				}
			}

			for ( var m = 0; m < i1.length; m++) {
				for ( var n = 0; n < i2.length; n++) {
					if ((i1[m] == -1 && i2[n] == -1)
							|| (i1[m] == this.hsize && i2[n] == this.hsize)) {
						return true;
					}
					var isConnected = true;
					if (i1[m] == i2[n]) {
						var min, max;
						if (j1 < j2) {
							min = j1;
							max = j2;
						} else {
							min = j2;
							max = j1;
						}

						for ( var x = min + 1; x < max; x++) {

							isConnected = isConnected
									&& this.wo[i1[m]][x].destroyed;
							// 要遍历任意一组发现是联通状态，则返回TRUE
							if (isConnected)
								this.liainTPoints.push(this.wo[i1[m]][x]);
						}
						if (isConnected)// 发现联通。立即返回结果，无需续集探测
							return true;
					}

				}

			}

			// scan2
			var j1 = new Array();

			var i1 = p1.id[0] - 1;

			for ( var j = p1.id[1]; j <= this.wsize; j++) {

				if (j == this.wsize || this.wo[i1][j].destroyed) {
					j1.push(j);
				} else {
					break;
				}
			}
			// 包含自己
			for ( var j = p1.id[1] - 1; j >= -1; j--) {

				if (j == -1 || j == p1.id[1] - 1 || this.wo[i1][j].destroyed) {
					j1.push(j);
				} else {
					break;
				}
			}

			var j2 = new Array();

			var i2 = p2.id[0] - 1;

			for ( var j = p2.id[1]; j <= this.wsize; j++) {

				if (j == this.wsize || this.wo[i2][j].destroyed) {
					j2.push(j);
				} else {
					break;
				}
			}

			for ( var j = p2.id[1] - 1; j >= -1; j--) {

				if (j == -1 || j == p2.id[1] - 1 || this.wo[i2][j].destroyed) {
					j2.push(j);
				} else {
					break;
				}
			}

			for ( var m = 0; m < j1.length; m++) {
				for ( var n = 0; n < j2.length; n++) {
					if ((j1[m] == -1 && j2[n] == -1)
							|| (j1[m] == this.wsize && j2[n] == this.wsize)) {
						return true;
					}

					var isConnected = true;
					if (j1[m] == j2[n]) {
						var min, max;
						if (i1 < i2) {
							min = i1;
							max = i2;
						} else {
							min = i2;
							max = i1;
						}

						for ( var x = min + 1; x < max; x++) {
							isConnected = isConnected
									&& this.wo[x][j1[m]].destroyed;
							if (isConnected)
								this.liainTPoints.push(this.wo[x][j1[m]]);
						}
						if (isConnected)
							return true;
					}

				}

			}

			// console.log('not direct connect');
			result = false;
		}
	} else {
		// console.log('fillStyle not match');
		result = false;
	}
	return result;

};