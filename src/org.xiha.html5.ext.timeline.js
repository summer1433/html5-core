/*
request org.xiha.html5.core
 */
request('org.xiha.html5.core');

org.xiha.html5.ext = {};
org.xiha.html5.ext.timeline = {};

// 扩展出HINT对象
org.xiha.html5.ext.timeline.Hint = function(scene, centerPosition, w, h, id) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);
	this.text = '';

};
org.xiha.html5.util.extend(org.xiha.html5.ext.timeline.Hint,
		org.xiha.html5.core.Cube);// 继承关系

org.xiha.html5.ext.timeline.Hint.prototype.setText = function(text) {
	this.text = text;
};

org.xiha.html5.ext.timeline.Hint.prototype.show = function() {

	this.canRenderme();

};

org.xiha.html5.ext.timeline.Hint.prototype.render = function() {

	var r = this.caculateRect(this.getCenterPosition(), this.getW(), this
			.getH());

	var ctx = this.scene.getContext();

	ctx.clearRect(r.x, r.y-12, r.w, r.h);// stroke是从中间开始描
	
	ctx.rect( r.x, r.y-12, r.w, r.h);
	ctx.fillStyle = "#8ED6FF";
    ctx.fill();
	
	ctx.lineWidth = '2';
	ctx.fillStyle = 'black';
	ctx.font = "12pt Calibri";
	ctx.fillText(this.text, r.x, r.y);
};

org.xiha.html5.ext.timeline.Hint.prototype.hide = function() {
	// this.text = text;
};

// 扩展出时间记录展示对象
org.xiha.html5.ext.timeline.TimeCube = function(scene, centerPosition, w, h,
		id, hint) {
	org.xiha.html5.core.Cube.call(this, scene, centerPosition, w, h, id);
	this.date = '';
	this.hint = hint;
};

org.xiha.html5.util.extend(org.xiha.html5.ext.timeline.TimeCube,
		org.xiha.html5.core.Cube);// 继承关系

org.xiha.html5.ext.timeline.TimeCube.prototype.renderbefore = function(text) {
	if (this.inSelect) {

		this.hint.setText(this.date);
		this.hint.show();
		console.log(this.date);
	}
};

/**
 * centerPosition:组件中心所处位置 w:最小单位块宽度 h:最小单位块高度
 */
org.xiha.html5.ext.timeline.Line = function(scene, centerPosition, w, h, size,
		hint) {
	this.hint = hint;
	var x = 10;
	var y = 50;
	var w = 5;
	var h = 30;
	var sepLen = 7;

	for ( var i = 0; i < size; i++) {
		x = x + sepLen;
		var tcube = new org.xiha.html5.ext.timeline.TimeCube(scene,
				new org.xiha.html5.core.NormalPoint(x, y), w, h, i + 1, hint);
		var fillStyle = 'hsl(0,0%,50%)';
		tcube.setFillStyle(fillStyle);
		tcube.clickEnable = true;
		tcube.date = "hello " + i;
		// cube2.enableMoving();

	}

};
