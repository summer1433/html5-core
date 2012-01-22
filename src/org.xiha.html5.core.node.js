request('org.xiha.html5.util');

org.xiha.html5.core.Node = function(obj, parentObj, childs) {
	this.node = obj;
	this.parent = parentObj;
	this.childs = childs;
	this.radian = null;
	this.addChild = function(child) {
		if (this.childs == null) {
			this.childs = new Array();
		}
		this.childs.push(child);
	};

	this.setParent = function(parent) {
		this.parent = parent;
	};

};

org.xiha.html5.core.NodeUtil = function(radius) {
	this.radius = radius;
	// 从根开始遍历结点
	this.ergod = function(root) {
		if (root.childs != null) {
			if (root.node instanceof org.xiha.html5.core.Cube) {
				if (root.parent == null && root.node.centerPosition == null) {
					var x = root.node.scene.getWidth() / 2;
					var y = root.node.scene.getHeight() / 2;
					root.node.centerPosition = new org.xiha.html5.core.NormalPoint(
							x, y);
					console.log(root);
					// console.log("root,X:"+x+",Y:"+y);
				} else {
					console.log(root.radian);
					if (root.radian != null && root.childs!=null) {
						// 延长结点连接线
						var Xi = root.node.centerPosition.getX() - (this.radius/3)
								* Math.cos(cnode.radian);
						var Yi = root.node.centerPosition.getY() + (this.radius/3)
								* Math.sin(cnode.radian);
						root.node.centerPosition = new org.xiha.html5.core.NormalPoint(
								Xi, Yi);
						console.log("ffff");
					}

				}

			}

			// console.log(root.node + "has child");
			var childn = root.childs;

			var degree = 360 / childn.length;
			var startDegree = 30;
			for ( var i = 0; i < childn.length; i++) {
				cnode = childn[i];
				new org.xiha.html5.core.Connector(root.node.scene, root.node,
						cnode.node, '#000000', '#000000', 1);
				cnode.radian = (startDegree + i * degree) * 0.017453293;
				var Xi = root.node.centerPosition.getX() - this.radius
						* Math.cos(cnode.radian);
				var Yi = root.node.centerPosition.getY() + this.radius
						* Math.sin(cnode.radian);
				cnode.node.centerPosition = new org.xiha.html5.core.NormalPoint(
						Xi, Yi);

				// console.log("child,X:"+Xi+",Y:"+Yi);

				this.ergod(cnode);

			}

		} else {
			// console.log("reach child edge");
		}

	};

};