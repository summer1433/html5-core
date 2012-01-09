request('org.xiha.html5.core');
request('org.xiha.html5.core.scene');

org.xiha.html5.core.Connector = function(scene, cube1, cube2, strokeStyle, fillStyle, lineWidth) {
	this.scene = scene;
	this.cube1 = cube1;
	this.cube2 = cube2;
	this.strokeStyle = strokeStyle;
	this.fillStyle = fillStyle;
	this.lineWidth = lineWidth;
	this.renderme = false;
	scene.addRenderable(this);
};

org.xiha.html5.core.Connector.prototype = {
		canRenderme : function() {
			this.renderme = true;
		},
		stopRenderme : function() {
			this.renderme = false;
		},
		isSelect:function() {
			return false;
		},
		render: function(){
			var ctx = this.scene.getContext();
			ctx.strokeStyle = this.strokeStyle;
			ctx.fillStyle = this.fillStyle;
			ctx.lineWidth = this.lineWidth;
			ctx.beginPath();
			ctx.moveTo(this.cube1.centerPosition.getX(), this.cube1.centerPosition.getY());
			ctx.lineTo(this.cube2.centerPosition.getX(), this.cube2.centerPosition.getY());
			ctx.stroke();
			//console.log("rend connector:"+this.cp1+","+this.cp2);
		
		}
		
};