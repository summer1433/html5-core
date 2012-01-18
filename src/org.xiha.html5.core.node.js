request('org.xiha.html5.util');

org.xiha.html5.core.Node = function(obj, parentObj, childs) {
	this.node = obj;
	this.parent = parentObj;
	this.childs = childs;

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
					var x = root.node.scene.getWidth()/2;
					var y = root.node.scene.getHeight()/2;
					root.node.centerPosition = new org.xiha.html5.core.NormalPoint(
							x, y);
					console.log(root);
					//console.log("root,X:"+x+",Y:"+y);
				}

			}

			//console.log(root.node + "has child");
			var childn = root.childs;

			var degree = 360 / childn.length;
			var startDegree = 30;
			for ( var i = 0; i < childn.length; i++) {
				cnode = childn[i];
				new org.xiha.html5.core.Connector(root.node.scene, root.node, cnode.node, '#000000',
						'#000000', 1);
				var Xi = root.node.centerPosition.getX() - this.radius
						* Math.cos((startDegree + i * degree)*0.017453293);
				var Yi = root.node.centerPosition.getY() + this.radius
						* Math.sin((startDegree + i * degree)*0.017453293);
				cnode.node.centerPosition = new org.xiha.html5.core.NormalPoint(Xi,
						Yi);
				
				//console.log("child,X:"+Xi+",Y:"+Yi);
				
				this.ergod(cnode);

			}

		} else {
			//console.log("reach child edge");
		}

	};

};