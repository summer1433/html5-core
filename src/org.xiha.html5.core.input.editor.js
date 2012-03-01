request('org.xiha.html5.core');
org.xiha.html5.core.input = {};
org.xiha.html5.core.input.Editor = function(editorId) {
	this.id = null;
	this.editorId = editorId;
	this.scene = window.org.xiha.html5.core.scene;
	this.object = null;
	this.currentEvent = null;
	this.w = null;
	this.h = null;
	this.renderText = null;
	document
			.write('<div style="display:none;position: absolute;color: black;background-color: #d4d144;text-indent: 2px;font: 12px/29px sans-serif;margin: 2px 0 0 1px;border: 1px dotted #ffffff;padding-top: 0;padding-bottom: 0;padding-right: 0;text-align: center;" id="'
					+ editorId + '" contenteditable="true" />');
	this.display = function(np) {
		var writeEditor = document.getElementById(this.editorId);
		writeEditor.style.position = 'absolute';
		writeEditor.style.left = np.getX() + 'px';
		writeEditor.style.top = np.getY() + 'px';
		if (this.h == null) {

			writeEditor.style.height = this.object.h + 'px';
		} else {
			writeEditor.style.height = this.h + 'px';
		}
		if (this.w == null) {
			writeEditor.style.width = this.object.w + 'px';
		} else {
			writeEditor.style.width = this.w + 'px';
		}

		if (this.object.renderableText != null) {
			writeEditor.innerText = this.object.renderableText.text();
		} else {
			writeEditor.innerText = '';
		}
		writeEditor.style.display = '';
		writeEditor.focus();
		writeEditor.bindEditor = this;
		writeEditor.onblur = function() {
			this.style.display = 'none';
			if (this.bindEditor.change != null) {
				this.bindEditor.renderText = new org.xiha.html5.core.RenderableText(
						this.innerText, "black", "12px/29px sans-serif");
				if (this.bindEditor.change()) {
					this.bindEditor.object.renderableText = this.bindEditor.renderText;

				}
			}
		};
		// document.getElementById(this.editorId + "_input").focus();

	};
	this.calPosition = function(obj) {
		var x = 0, y = 0;
		var left = org.xiha.html5.util.getTrueOffsetLeft(this.scene.canvas);
		var top = org.xiha.html5.util.getTrueOffsetTop(this.scene.canvas);
		if (obj.w != null) {
			// 反向计算div绝对位置
			x = obj.getCenterPosition().getX() - (obj.w / 2) + left;
			y = obj.getCenterPosition().getY() - (obj.h / 2) + top;
		}
		return new org.xiha.html5.core.NormalPoint(x, y);
	};
	this.scene.addRenderable(this);
};

org.xiha.html5.core.input.Editor.prototype.listenEvent = function(ev) {
	this.currentEvent = ev;
	this.object = ev.object;
	if (ev.msg == (new org.xiha.html5.core.Constants()).DOUBLE_CLICK_EVENT) {

		this.display(this.calPosition(this.object));
	}
};
