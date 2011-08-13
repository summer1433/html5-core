org.xiha.html5.util = {
	getTrueOffsetLeft : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetLeft || 0;
			ele = ele.offsetParent;
		}

		return n;
	},
	getTrueOffsetTop : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetTop || 0;
			ele = ele.offsetParent;
		}
		return n;
	},

	getMouse : function(e, canvas) {
		var width = canvas.width;
		var height = canvas.height;
		var x = e.clientX - this.getTrueOffsetLeft(canvas) + window.pageXOffset;
		var y = e.clientY - this.getTrueOffsetTop(canvas) + window.pageYOffset;

		// 控制边界
		return [ Math.min(width - 3, Math.max(3, x)),
				Math.min(height - 3, Math.max(3, y)) ];

	},

	extend : function(child, parent) {

		var tmp = function() {

		};
		tmp.prototype = parent.prototype;
		child.prototype = new tmp();
		child.prototype.constructor = child;

	}
};