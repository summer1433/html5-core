request('org.xiha.html5.util');

org.xiha.html5.core.Node = function(obj, parentObj, childs) {
	this.obj = obj;
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

	if (window.org.xiha.html5.core.scene.rootNode == null) {
		window.org.xiha.html5.core.scene.setRootNode(this);
	}

	var nodeAutoUtil = new org.xiha.html5.core.NodeAutoUtil();
	nodeAutoUtil.autoAddToRoot(window.org.xiha.html5.core.scene.rootNode, this);

};

org.xiha.html5.core.NodeAutoUtil = function() {
	this.autoSearchedParent = new Array();

	this.autoAddToRoot = function(node, thisNode) {
		this.search(node, thisNode);

		for ( var i = 0; i < this.autoSearchedParent.length; i++) {
			this.autoSearchedParent[i].addChild(thisNode);
		}

	};
	this.search = function(node, thisNode) {

		if (node.childs != null) {
			if (node.obj.id != null && thisNode.parent != null
					&& thisNode.parent.id != null
					&& node.obj.id == thisNode.parent.id) {

				this.autoSearchedParent.push(node);
			}
			// 继续遍历child[0..n]
			var childn = node.childs;
			for ( var i = 0; i < childn.length; i++) {
				cnode = childn[i];

				this.search(cnode, thisNode);

			}

		} else {
			if (node.obj.id != null && thisNode.parent != null
					&& thisNode.parent.id != null
					&& node.obj.id == thisNode.parent.id) {
				this.autoSearchedParent.push(node);

			}

			// console.log("reach child edge");
		}

	};
};

org.xiha.html5.core.NodeUtil = function(radius) {
	// this.matchedNodes = new Array();
	this.connectorUtil = new org.xiha.html5.core.ConnectorUtil();
	this.radius = radius;
	// 从根开始遍历结点

	this.ergod = function(root) {
		
		if (root.obj instanceof org.xiha.html5.core.Cube) {
			if (root.parent == null && root.obj.centerPosition == null) {
				var x = Math.floor(root.obj.scene.getWidth() / 2);
				var y = Math.floor(root.obj.scene.getHeight() / 2);
				root.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
						x, y);
				// console.log("root,X:"+x+",Y:"+y);
			} else {
				// console.log(root.radian);
				if (root.radian != null && root.childs != null) {
					// 延长子结点连接线
					var Xi = Math.floor(root.obj.centerPosition.getX()
							- (this.radius * 0.618) * Math.cos(cnode.radian));
					var Yi = Math.floor(root.obj.centerPosition.getY()
							+ (this.radius * 0.618) * Math.sin(cnode.radian));
					root.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
							Xi, Yi);
				}

			}

		}
		
		if (root.childs != null) {
			

			// console.log(root.node + "has child");
			var childn = root.childs;

			var degree = 360 / childn.length;
			var startDegree = 30;
			for ( var i = 0; i < childn.length; i++) {
				cnode = childn[i];
				this.connectorUtil.bindingConnector(root.obj, cnode.obj,
						'#121011', '#121011', 1);

				cnode.radian = (startDegree + i * degree) * 0.017453293;
				var Xi = Math.floor(root.obj.centerPosition.getX()
						- this.radius * Math.cos(cnode.radian));
				var Yi = Math.floor(root.obj.centerPosition.getY()
						+ this.radius * Math.sin(cnode.radian));
				cnode.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
						Xi, Yi);

				// console.log("child,X:"+Xi+",Y:"+Yi);

				this.ergod(cnode);

			}

		} else {
			// console.log("reach child edge");
		}

	};

};