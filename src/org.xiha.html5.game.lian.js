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

	this.render = function() {

	};
	var r = this.caculateRect(this.getCenterPosition(), this.getW(), this
			.getH());

	ctx.clearRect(r.x, r.y, r.w, r.h);

	this.clickEnable = false;
	this.destroyed = true;

};
org.xiha.html5.game.lian.Pokers = function(scene, normalPoint, wsize, hsize,
		images) {

	var pw = 50;
	var ph = 50;
	var psx1 = normalPoint.getX() - (pw * (wsize / 2));
	var psy1 = normalPoint.getY() - (ph * (hsize / 2));
	this.wsize = wsize;
	this.hsize = hsize;

	var pokerImages = new Array();
	var pokerNum = this.wsize * this.hsize;

	if (pokerNum % 2 != 0) {
		console.log('error not divide by 2 oOoOOOooOOooo00');
	}
	var imageIndex = 0;
	for ( var i = 0; i < pokerNum; i = i + 2) {
		if (imageIndex < images.length) {
			pokerImages.push(images[imageIndex]);
			pokerImages.push(images[imageIndex]);
			imageIndex++;
		} else {
			var randomIndex = Math.floor(Math.random() * 1000) % images.length;
			pokerImages.push(images[randomIndex]);
			pokerImages.push(images[randomIndex]);
		}

	}

	var tmp = new Image();
	// 乱序images
	for ( var i = 0; i < 1000; i++) {
		var l = Math.floor(Math.random() * 1000) % pokerImages.length;
		tmp = pokerImages[l];
		pokerImages[l] = pokerImages[0];
		pokerImages[0] = tmp;

	}

	this.scene = scene;
	this.wo = new Array();
	this.line = new org.xiha.html5.core.Line(this.scene, 2);

	for ( var i = 0; i < hsize; i++) {
		var ho = new Array();

		for ( var j = 0; j < wsize; j++) {

			var np = new org.xiha.html5.core.NormalPoint(psx1 + (j + 1 / 2)
					* pw, psy1 + (i + 1 / 2) * ph);
			var poker = new org.xiha.html5.game.lian.Poker(scene, np, pw, ph, {
				'i' : i,
				'j' : j
			});

			poker.image = pokerImages[i * wsize + j];
			poker.setFillStyle('#ffffff');
			poker.clickEnable = true;
			// poker.canRenderme();
			ho.push(poker);
		}
		this.wo.push(ho);
	}
	this.selectedPokers = new Array();

	var self = this;

	clickAction = function() {

		var selectedPokerNum = 0;
		var p1 = '', p2 = '';

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
						if (self.checkLianTong(p1, p2)) {
							// TODO draw line

							console.log('destroy selected');
							console.log(self.line.points);
							p1.destroy();
							p2.destroy();
/*
							ctx.strokeStyle = 'hsl('
									+ Math.floor(360 * Math.random()) + ', '
									+ Math.floor(Math.random() * 100) + '%, '
									+ Math.floor(Math.random() * 100) + '%)'; // line
							// color

							for ( var mm = 0; mm < self.line.points.length; mm++) {
								var p = self.line.points[mm];
								ctx.beginPath();
								ctx.arc(p.getX(), p.getY(), 5, 0, Math.PI * 2,
										true);
								ctx.closePath();
								ctx.lineWidth = 2;

								ctx.stroke();
							}
							*/
							self.line.clearPoints();

						}
						p1.inSelect = false;
						p2.inSelect = false;
						selectedPokerNum = 0;

						break;

					}

					// self.selectedPokers.push(self.wo[i][j]);
					// console.log(self.wo[i][j]);
				}
			}
		}

		// console.log('selectedPokerNum:' + selectedPokerNum);

	};

	// add click listener

	scene.canvas.addEventListener('click', clickAction, false);

};

org.xiha.html5.game.lian.Pokers.prototype.checkLianTong = function(p1, p2) {

	var result = false;

	if (p1.image.src == p2.image.src) {
		if ((Math.abs(p1.id.i - p2.id.i) == 1 && p1.id.j - p2.id.j == 0)
				|| (Math.abs(p1.id.j - p2.id.j) == 1 && p1.id.i - p2.id.i == 0)) {
			// 两个Poker刚好相邻
			this.line.addPoint(p1.getCenterPosition());
			this.line.addPoint(p2.getCenterPosition());

			result = true;
		} else {
			// scan1
			var i1 = new Array(), i2 = new Array();

			for ( var i = p1.id.i; i <= this.hsize; i++) {

				if (i == this.hsize) {
					i1.push(this.hsize);
					break;
				} else if (this.wo[i][p1.id.j].inSelect
						|| this.wo[i][p1.id.j].destroyed) {
					i1.push(i);
				} else {
					break;
				}
			}

			for ( var i = p1.id.i; i >= -1; i--) {

				if (i == -1) {
					i1.push(-1);
					break;
				} else if (this.wo[i][p1.id.j].inSelect
						|| this.wo[i][p1.id.j].destroyed) {
					i1.push(i);
				} else {
					break;
				}
			}

			for ( var i = p2.id.i; i <= this.hsize; i++) {

				if (i == this.hsize) {
					i2.push(this.hsize);
					break;
				} else if (this.wo[i][p2.id.j].inSelect
						|| this.wo[i][p2.id.j].destroyed) {
					i2.push(i);
				} else {
					break;
				}
			}
			// 包含自己
			for ( var i = p2.id.i; i >= -1; i--) {

				if (i == -1) {
					i2.push(-1);
					break;
				} else if (this.wo[i][p2.id.j].inSelect
						|| this.wo[i][p2.id.j].destroyed) {
					i2.push(i);
				} else {
					break;
				}
			}

			var minY, maxY;
			if (p1.id.j < p2.id.j) {
				minY = p1.id.j;
				maxY = p2.id.j;
				this.line.addPoint(p1.getCenterPosition());
			} else {
				minY = p2.id.j;
				maxY = p1.id.j;
				this.line.addPoint(p2.getCenterPosition());

			}

			for ( var m = 0; m < i1.length; m++) {
				for ( var n = 0; n < i2.length; n++) {
					if ((i1[m] == -1 && i2[n] == -1)
							|| (i1[m] == this.hsize && i2[n] == this.hsize)) {
						return true;
					}
					var isConnected = true;
					if (i1[m] == i2[n]) {
						var currentX = i1[m];

						for ( var y = minY; y <= maxY; y++) {
							var checkPoiont = this.wo[currentX][y];
							isConnected = isConnected
									&& (checkPoiont.destroyed || checkPoiont.inSelect);
							// 要遍历任意一组发现是联通状态，则返回TRUE

						}
						if (isConnected) {
							console.log(minY + ',' + maxY);
							this.line.addPoint(this.wo[currentX][minY]
									.getCenterPosition());
							this.line.addPoint(this.wo[currentX][maxY]
									.getCenterPosition());
							return true;
						}// 发现联通。立即返回结果，无需续集探测
						else {
							this.line.clearPoints();
						}
					}

				}

			}

			// scan2
			var j1 = new Array(), j2 = new Array();

			for ( var j = p1.id.j; j <= this.wsize; j++) {

				if (j == this.wsize) {
					j1.push(this.wsize);
					break;
				} else if (this.wo[p1.id.i][j].inSelect
						|| this.wo[p1.id.i][j].destroyed) {
					j1.push(j);
				} else {
					break;
				}
			}
			// 包含自己
			for ( var j = p1.id.j; j >= -1; j--) {

				if (j == -1) {
					j1.push(-1);
					break;
				} else if (this.wo[p1.id.i][j].inSelect
						|| this.wo[p1.id.i][j].destroyed) {
					j1.push(j);
				} else {
					break;
				}
			}

			for ( var j = p2.id.j; j <= this.wsize; j++) {

				if (j == this.wsize) {
					j2.push(this.wsize);
					break;
				} else if (this.wo[p2.id.i][j].inSelect
						|| this.wo[p2.id.i][j].destroyed) {
					j2.push(j);
				} else {
					break;
				}
			}

			for ( var j = p2.id.j; j >= -1; j--) {

				if (j == -1) {
					j2.push(-1);
					break;
				} else if (this.wo[p2.id.i][j].inSelect
						|| this.wo[p2.id.i][j].destroyed) {
					j2.push(j);
				} else {
					break;
				}
			}

			var minX, maxX;
			if (p1.id.i < p2.id.i) {
				minX = p1.id.i;
				maxX = p2.id.i;
				this.line.addPoint(p1.getCenterPosition());

			} else {
				minX = p2.id.i;
				maxX = p1.id.i;
				this.line.addPoint(p2.getCenterPosition());

			}

			for ( var m = 0; m < j1.length; m++) {
				for ( var n = 0; n < j2.length; n++) {
					if ((j1[m] == -1 && j2[n] == -1)
							|| (j1[m] == this.wsize && j2[n] == this.wsize)) {
						return true;
					}

					var isConnected = true;
					if (j1[m] == j2[n]) {
						var currentY = j1[m];

						for ( var x = minX; x <= maxX; x++) {
							var checkPoiont = this.wo[x][currentY];
							isConnected = isConnected
									&& (checkPoiont.destroyed || checkPoiont.inSelect);
						}
						if (isConnected) {
							console.log(minX + ',' + maxX);

							this.line.addPoint(this.wo[minX][currentY]
									.getCenterPosition());
							this.line.addPoint(this.wo[maxX][currentY]
									.getCenterPosition());
							return true;
						} else {
							this.line.clearPoints();

						}
					}

				}

			}

			result = false;
		}
	} else {
		result = false;
	}
	return result;

};