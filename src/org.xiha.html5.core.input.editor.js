request('org.xiha.html5.core');
org.xiha.html5.core.input = {};
org.xiha.html5.core.input.Editor = function(editorId) {
	this.id = null;
	this.editorId = editorId;
	this.scene = window.org.xiha.html5.core.scene;
	this.object = null;
	this.currentEvent = null;
	this.display = function(np) {
		var writeEditor = document.getElementById(this.editorId);
		writeEditor.style.position = "absolute";
		writeEditor.style.left = np.getX() + "px";
		writeEditor.style.top = np.getY() + "px";
		if (this.object.renderableText != null) {
			writeEditor.innerText = this.object.renderableText.text();
		} else {
			writeEditor.innerText = '';
		}
		writeEditor.style.display = "";
		writeEditor.focus();
		writeEditor.bindEditor = this;
		writeEditor.onblur = function() {
			this.style.display = "none";
			if (this.bindEditor.change != null) {
				var oldText = this.bindEditor.object.renderableText.text();
				var newRenderText = new org.xiha.html5.core.RenderableText(
						this.innerText, "black", "12px/29px sans-serif");
				var newText = newRenderText.text();
				if (this.bindEditor.change(oldText, newText)) {
					this.bindEditor.object.renderableText = newRenderText;

				}
			}
		};
		// document.getElementById(this.editorId + "_input").focus();

	};
	this.scene.addRenderable(this);
};

org.xiha.html5.core.input.Editor.prototype.listenEvent = function(ev) {
	this.currentEvent = ev;
	this.object = ev.object;
	if (ev.msg == (new org.xiha.html5.core.Constants()).DOUBLE_CLICK_EVENT) {
		var x = 0, y = 0;
		var left = org.xiha.html5.util.getTrueOffsetLeft(this.scene.canvas);
		var top = org.xiha.html5.util.getTrueOffsetTop(this.scene.canvas);
		if (ev.object.w != null) {
			// 反向计算div绝对位置
			x = ev.object.getCenterPosition().getX() - (ev.object.w / 2) + left;
			y = ev.object.getCenterPosition().getY() - (ev.object.h / 2) + top;
		}
		var np = new org.xiha.html5.core.NormalPoint(x, y);
		this.display(np);
	}
};
