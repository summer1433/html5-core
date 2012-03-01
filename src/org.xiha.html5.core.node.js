request('org.xiha.html5.util');

org.xiha.html5.core.Node = function(obj, parentObj) {
	this.obj = obj;
	this.parent = parentObj;
	this.childs = null;
	this.radian = null;
	this.id = null;

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
	if (parentObj != null) {
		window.org.xiha.html5.core.connectorUtil.bindingConnector(obj,
				parentObj, '#121011', '#121011', 1);
	}
	var nodeAutoUtil = new org.xiha.html5.core.NodeAutoUtil();
	nodeAutoUtil.autoAddToRoot(window.org.xiha.html5.core.scene.rootNode, this);
	window.org.xiha.html5.core.nodeUtil.addNode(this);
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

org.xiha.html5.core.force = function(f, radian) {
	this.f = f;
	this.radian = radian;
	this.wastage = function() {
		if (f < this.minFZero) {
			f = 0;
		}

	};
};

org.xiha.html5.core.NodeUtil = function(radius) {
	this.countfb = 0;
	this.isfb = true;
	this.nodeIdSequence = 0;
	this.nodesMap = {};
	this.nodes = new Array();
	// this.matchedNodes = new Array();
	this.connectorUtil = new org.xiha.html5.core.ConnectorUtil();
	this.radius = radius;
	this.kPush = 0.2;
	this.kPull = 0.075;
	this.minLen = 50;
	// 从根开始遍历结点
	this.genPushForce = function(beginPoint, endPoint) {
		var a = endPoint.getY() - beginPoint.getY();
		var b = endPoint.getX() - beginPoint.getX();

		var c = this.abc(a, b);

		var f = this.kPush * (100 / (c.c));
		return new org.xiha.html5.core.force(f, c.r);
	};

	this.genPullForce = function(beginPoint, endPoint) {
		var a = endPoint.getY() - beginPoint.getY();
		var b = endPoint.getX() - beginPoint.getX();

		var r = 0;
		var f = 0;

		var c = this.abc(a, b);

		var subLen = c.c - this.minLen;
		f = Math.abs(this.kPull * subLen);

		if (subLen > 0) {
			r = c.r;
		} else {
			r = c.r + Math.PI;
		}
		return new org.xiha.html5.core.force(f, r);
	};

	this.abc = function(a, b) {
		var r = 0;
		var c = 0;

		if (a > 0 && b < 0) {
			r = Math.atan(a / b) + Math.PI;
			c = a / Math.sin(r);

		} else if (a > 0 && b > 0) {
			r = Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a == 0 && b < 0) {
			r = Math.PI;
			c = -b;

		} else if (a == 0 && b > 0) {
			r = 0;
			c = b;

		} else if (a < 0 && b < 0) {
			r = -Math.PI + Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a < 0 && b > 0) {
			r = Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a > 0 && b == 0) {
			r = Math.PI / 2;
			c = a;

		} else if (a < 0 && b == 0) {
			r = -Math.PI / 2;
			c = -a;

		} else if (a == 0 && b == 0) {
			r = 0;
			c = 0;
		}
		return {
			'c' : c,
			'r' : r
		};
	};
	this.addForce = function(f1, f2) {
		var a = Math.sin(f1.radian) * f1.f + Math.sin(f2.radian) * f2.f;
		var b = Math.cos(f1.radian) * f1.f + Math.cos(f2.radian) * f2.f;
		var c = this.abc(a, b);
		var f = c.c;
		return new org.xiha.html5.core.force(f, c.r);

	};

	this.forceBalance = function() {
		if (this.isfb) {
			this.countfb++;
			for ( var i = 0; i < this.nodes.length; i++) {
				var forceNode = this.nodes[i];
				var fn = new org.xiha.html5.core.force(0, 0);
				var f0 = new org.xiha.html5.core.force(0, 0);
				// console.log('开始计算nodeid:' + forceNode.id + '的受力');
				if (forceNode.id != 0) {
					for ( var j = 0; j < this.nodes.length; j++) {
						if (forceNode.id != this.nodes[j].id) {
							var tmpf0 = this.genPushForce(
									this.nodes[j].obj.centerPosition,
									forceNode.obj.centerPosition);
							// var c = tmpf.radian / 0.017453293;
							// console.log('受到nodeid:[' + this.nodes[j].id +
							// ']的力,角度'
							// + c + ',大小[' + tmpf.f + ']');
							f0 = this.addForce(tmpf0, f0);
							// var c0 = f0.radian / 0.017453293;
							// console.log('合并后合力为[' + c0 + '],大小为[' + f0.f +
							// ']');
						}
					}
				}
				// console.log(forceNode.id + '受到' + nn + '个推力，合力=');
				// console.log(f0);
				var f1 = new org.xiha.html5.core.force(0, 0);
				if (forceNode.parent != null) {
					f1 = this.genPullForce(forceNode.obj.centerPosition,
							forceNode.parent.centerPosition);
				}
				// var c1 = f1.radian / 0.017453293;
				// console.log('拉力f1['+c1+'],大小为['+f1.f+']');
				var fc = new org.xiha.html5.core.force(0, 0);
				if (forceNode.childs != null) {
					// if (this.countfb < 30) {
					// console
					// .log('字节点应力添加前f=' + f1.f + ',r='
					// + f1.radian);
					// }

					for ( var m = 0; m < forceNode.childs.length; m++) {
						var tmpchild = forceNode.childs[m];
						var tmpf1 = this.genPullForce(
								forceNode.obj.centerPosition,
								tmpchild.obj.centerPosition);
						// if (this.countfb < 30) {
						//
						// console.log('tmpf1,f=' + tmpf1.f + ',r='
						// + tmpf1.radian);
						// }
						fc = this.addForce(fc, tmpf1);
					}
					f1 = this.addForce(fc, f1);
					// if (this.countfb < 30) {
					// console.log('子节点合力f=' + fc.f + ',r=' + fc.radian);
					//
					// console.log('合力运算后f=' + f1.f + ',r=' + f1.radian);
					// }
				}

				// console.log(forceNode.id + '受到1个推力，合力=');
				// console.log(f1);

				fn = this.addForce(f1, f0);

				// console.log(f2);
				// var c0 = f2.radian / 0.017453293;
				// console.log('最终合并合力为[' + c0 + '],大小为[' + f0.f + ']');
				var x = forceNode.obj.centerPosition.getX() + fn.f
						* Math.cos(fn.radian);
				var y = forceNode.obj.centerPosition.getY() + fn.f
						* Math.sin(fn.radian);
				forceNode.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
						x, y);
			}
		}
	};

	this.addNode = function(node) {
		this.nodeIdSequence++;

		if (node.id == null) {
			node.id = this.nodeIdSequence;
			this.nodesMap[this.nodeIdSequence] = node;
			this.nodes.push(node);
		} else if (node.id >= 0) {
			if (this.nodesMap[node.id] == null) {
				this.nodesMap[node.id] = node;
				this.nodes.push(node);
			} else {
				console.log("node already exist, node is:");
				console.log(node);
			}
		}

	};

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

				cnode.radian = (startDegree + i * degree) * 0.017453293;
				var Xi = Math.floor(root.obj.centerPosition.getX()
						- this.radius * Math.cos(cnode.radian));
				var Yi = Math.floor(root.obj.centerPosition.getY()
						+ this.radius * Math.sin(cnode.radian));
				cnode.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
						Xi, Yi);

				window.org.xiha.html5.core.connectorUtil.bindingConnector(
						root.obj, cnode.obj, '#121011', '#121011', 1);
				// console.log("child,X:"+Xi+",Y:"+Yi);

				this.ergod(cnode);

			}

		} else {
			// console.log("reach child edge");
		}

	};

	this.searchNodeByCubeId = function(cubeId) {
		for ( var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].obj.id != null && this.nodes[i].obj.id == cubeId) {
				return this.nodes[i];
			}
		}
		return null;
	};

	this.combineNode = function(frmNode, toNode, pNode) {
		var pObj = toNode.obj;
		// 1.将frmNode的孩子过继给toNode
		if (frmNode.childs != null && frmNode.childs.length != 0) {
			for ( var i = 0; i < frmNode.childs.length; i++) {
				if (toNode.childs == null) {
					toNode.childs = new Array();
				}
				frmNode.childs[i].parent = pObj;
				window.org.xiha.html5.core.connectorUtil.bindingConnector(
						frmNode.childs[i].parent, frmNode.childs[i].obj,
						'#121011', '#121011', 1);
				toNode.childs.push(frmNode.childs[i]);
			}
		}
		// 2.找到frmNode的父亲，将其从父亲的孩子节点中删除，并toNode设置为其父亲的孩子
		var reMoveIdx = -1;
		for ( var i = 0; i < pNode.childs.length; i++) {
			if (pNode.childs[i].id == frmNode.id) {
				reMoveIdx = i;
				break;
			}
		}
		if (reMoveIdx >= 0) {
			pNode.childs.splice(reMoveIdx, 1, toNode);
		}
		// 3.消除连接，并建立新连接
		window.org.xiha.html5.core.connectorUtil
				.destoryConnector(frmNode.obj.id);
		new org.xiha.html5.core.Node(toNode.obj, pNode.obj, null);
		// new node
		// 4.清除frmNode中包含的cube对象，并最终清除frmNode对象
		window.org.xiha.html5.core.scene.removeRenderable(frmNode.obj.id);
		delete frmNode.obj;
		this.removeNode(frmNode);
	};

	// 从树上的子节点删除所有节点，释放内存
	this.removeAllFromParentTree = function(cNode) {
		if (cNode.childs != null && cNode.childs.length != 0) {
			while (cNode.childs != null || cNode.childs.length != 0) {
				var tmpNode = cNdoe.childs.pop();
				this.removeAllFromParentTree(tmpNode);
				this.removeNode(tmpNode);
			}

		} else {
			this.removeNode(cNode);
		}
	};

	this.removeNode = function(node) {
		delete this.nodesMap[node.id];
		for ( var i = 0; i < this.nodes.length; i++) {
			if (node.id == this.nodes[i].id) {
				this.nodes.splice(i, 1);
				break;
			}
		}

	};

	this.searchNodeByText = function(text) {

		for ( var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].obj.renderableText != null
					&& this.nodes[i].obj.renderableText.text() == text) {
				return this.nodes[i];
			}
		}
		return null;
	};

	window.org.xiha.html5.core.nodeUtil = this;

};